import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const pokemon = sqliteTable("pokemon", {
	pokedexNumber: integer("pokedex_number").primaryKey(),
	name: text("name"),
	generation: integer("generation"),
	status: text("status"),
	type1: text("type_1"),
	type2: text("type_2"),
	ability1: text("ability_1"),
	ability2: text("ability_2"),
	abilityHidden: text("ability_hidden"),
	totalPoints: integer("total_points"),
	hp: integer("hp"),
	attack: integer("attack"),
	defense: integer("defense"),
	spAttack: integer("sp_attack"),
	spDefense: integer("sp_defense"),
	speed: integer("speed"),
	eggType1: text("egg_type_1"),
	eggType2: text("egg_type_2"),
	percentageMale: real("percentage_male"),
})
