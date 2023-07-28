import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { env } from '@/env.mjs'

const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
})

import * as schema from './schema'

export const db = drizzle(client, {
    schema,
    logger: process.env.NODE_ENV === 'development',
})
