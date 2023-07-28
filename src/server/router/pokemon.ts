import { createTRPCRouter, publicProcedure } from "../trpc"

export const pokemonRouter = createTRPCRouter({
    all: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.pokemon.findMany()
    }),
})
