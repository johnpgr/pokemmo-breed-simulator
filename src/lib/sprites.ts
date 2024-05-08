export const BASE_SPRITES_URL = "https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/regular"
export const BASE_ITEM_SPRITES_URL = "https://raw.githubusercontent.com/msikma/pokesprite/master/items"

export function getPokemonSpriteUrl(name: string) {
    const nameFixed = name
        .replace("'", "")
        .replace(" ♂", "-m")
        .replace(" ♀", "-f")
        .replace("Mr. Mime", "mr-mime")
        .replace("Mime Jr.", "mime-jr")

    return `${BASE_SPRITES_URL}/${nameFixed.toLowerCase()}.png`
}

export function getEvItemSpriteUrl(item: string) {
    if (item === "everstone") return `${BASE_ITEM_SPRITES_URL}/hold-item/${item}.png`

    return `${BASE_ITEM_SPRITES_URL}/ev-item/${item}.png`
}
