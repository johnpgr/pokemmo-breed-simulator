import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { type TRPCRouter } from "./router/root";

export { createTRPCContext } from "./trpc";

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<TRPCRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<TRPCRouter>;
