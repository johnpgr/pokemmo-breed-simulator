import type { Config } from "drizzle-kit"
import { env } from "@/env.mjs"

export default {
    schema: "./schema.ts",
    out: "./mutations",
    driver: "turso",
    dbCredentials: {
        url: env.DATABASE_URL,
        authToken: env.DATABASE_TOKEN,
    },
} satisfies Config
