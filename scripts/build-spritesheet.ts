import fs from "fs"
import path from "path"
import sharp from "sharp"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, "..")
const publicDir = path.join(projectRoot, "public")
const monsterJsonPath = path.join(publicDir, "monster.json")
const outSpritesheetPath = path.join(publicDir, "monsters-spritesheet.png")
const outMappingPath = path.join(publicDir, "monster-sprites.json")

function getSpriteUrl(name: string) {
  const nameFixed = name
    .replace("'", "")
    .replace("♂", "-m")
    .replace("♀", "-f")
    .replace("Mr. Mime", "mr-mime")
    .replace("Mime Jr.", "mime-jr")

  return `https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/regular/${nameFixed.toLowerCase()}.png`
}

async function main() {
  if (!fs.existsSync(monsterJsonPath)) {
    console.error("monster.json not found in public/")
    process.exit(1)
  }

  const monsters = JSON.parse(fs.readFileSync(monsterJsonPath, "utf8"))

  console.log(`Found ${monsters.length} monster entries`)

  // download all sprites (in sequence to be gentle)
  const buffers: Buffer[] = []
  for (const m of monsters) {
    const url = getSpriteUrl(m.name)
    process.stdout.write(`Downloading ${m.id} ${m.name} ... `)
    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.log(`failed: ${res.status}`)
        // push a transparent placeholder (32x32)
        buffers.push(
          await sharp({
            create: {
              width: 32,
              height: 32,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
          })
            .png()
            .toBuffer(),
        )
        continue
      }

      const buf = Buffer.from(await res.arrayBuffer())
      // ensure png
      const png = await sharp(buf).png().toBuffer()
      buffers.push(png)
      console.log("ok")
    } catch (err) {
      console.log("error", err)
      buffers.push(
        await sharp({
          create: {
            width: 32,
            height: 32,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          },
        })
          .png()
          .toBuffer(),
      )
    }
  }

  // measure widths and heights, normalize to max height
  const metas = await Promise.all(buffers.map((b) => sharp(b).metadata()))
  const maxH = Math.max(...metas.map((m) => m.height ?? 32))
  // resize each image to have same height (preserve aspect ratio) and pad to maxH
  const resizedBuffers = await Promise.all(
    buffers.map((b) => {
      return sharp(b)
        .resize({ height: maxH })
        .extend({
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()
    }),
  )

  const resizedMetas = await Promise.all(
    resizedBuffers.map((b) => sharp(b).metadata()),
  )
  const finalWidths = resizedMetas.map((m) => m.width ?? 32)
  const finalHeights = resizedMetas.map((m) => m.height ?? maxH)

  // compute uniform cell size (largest resized width/height)
  const cellWidth = Math.max(...finalWidths)
  const cellHeight = Math.max(...finalHeights)

  // determine grid layout: columns x rows (roughly square)
  const n = monsters.length
  const columns = Math.ceil(Math.sqrt(n))
  const rows = Math.ceil(n / columns)

  const totalWidth = columns * cellWidth
  const totalHeight = rows * cellHeight

  // create a blank canvas and composite each image into its cell, centered
  const comps: sharp.OverlayOptions[] = []
  const mapping: Record<
    string,
    { x: number; y: number; width: number; height: number }
  > = {}

  for (let i = 0; i < monsters.length; i++) {
    const buf = resizedBuffers[i]
    const w = finalWidths[i]
    const h = finalHeights[i]
    const col = i % columns
    const row = Math.floor(i / columns)
    // center the sprite inside its cell
    const left = col * cellWidth + Math.floor((cellWidth - w) / 2)
    const top = row * cellHeight + Math.floor((cellHeight - h) / 2)
    mapping[String(monsters[i].id)] = { x: left, y: top, width: w, height: h }
    comps.push({ input: buf, left, top })
  }

  const sheet = sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(comps)
    .png()

  await sheet.toFile(outSpritesheetPath)
  fs.writeFileSync(outMappingPath, JSON.stringify(mapping, null, 2), "utf8")

  console.log(`Wrote spritesheet to ${outSpritesheetPath}`)
  console.log(`Wrote mapping to ${outMappingPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
