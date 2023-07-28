const BASE_SPRITES_URL = "https://veekun.com/dex/media/pokemon/main-sprites/black-white"

export function getSpriteForPkmnNumber(number: number) {
  return `${BASE_SPRITES_URL}/${number}.png`
}
