import { pokemonRouter } from "./pokemon";
import { createTRPCRouter } from "../trpc";

export const trpcRouter = createTRPCRouter({
    pokemon: pokemonRouter,
});

// export type definition of API
export type TRPCRouter = typeof trpcRouter;
