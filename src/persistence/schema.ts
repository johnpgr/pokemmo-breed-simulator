import { PokemonIvSchema, PokemonNatureSchema } from "@/core/pokemon"
import { PokemonBreedTreeNodeSerializedSchema } from "@/core/tree/BreedTreeNode"
import { z } from "zod"

export const PokemonBreedTreeSerializedSchema = z.object({
    breedTarget: z.object({
        ivs: z.object({
            A: PokemonIvSchema,
            B: PokemonIvSchema,
            C: PokemonIvSchema.optional(),
            D: PokemonIvSchema.optional(),
            E: PokemonIvSchema.optional(),
        }),
        nature: PokemonNatureSchema.optional(),
    }),
    breedTree: z.record(z.string(), PokemonBreedTreeNodeSerializedSchema),
})
export type PokemonBreedTreeSerialized = z.infer<typeof PokemonBreedTreeSerializedSchema>
