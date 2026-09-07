import pg from 'pg'
import { config } from '../config.js'
import { logger } from '../lib/logger.js'

// Postgres returns NUMERIC as a string to avoid precision loss. Ratings are the
// only numerics here and they are safely small, so parse them as numbers.
pg.types.setTypeParser(1700, (v) => (v === null ? null : Number.parseFloat(v)))

export const pool = new pg.Pool({
  connectionString: config.db.url,
  ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
  max: config.db.poolMax,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
})

pool.on('error', (err) => {
  logger.error({ err }, 'idle postgres client error')
})

export const query = (text, params) => pool.query(text, params)

/** Runs `fn` inside a transaction, rolling back on any throw. */
export async function withTransaction(fn) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    throw err
  } finally {
    client.release()
  }
}

export const closePool = () => pool.end()
