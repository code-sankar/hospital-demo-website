import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool, withTransaction, closePool } from './pool.js'
import { logger } from '../lib/logger.js'

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), 'migrations')

/**
 * Applies every .sql file in migrations/ that has not run yet, in filename
 * order, each inside its own transaction. Safe to run repeatedly — that is how
 * it is meant to be used on deploy.
 */
export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const { rows } = await pool.query('SELECT name FROM schema_migrations')
  const applied = new Set(rows.map((r) => r.name))

  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort()
  const pending = files.filter((f) => !applied.has(f))

  if (pending.length === 0) {
    logger.info('database is up to date')
    return []
  }

  for (const file of pending) {
    const sql = await readFile(join(migrationsDir, file), 'utf8')
    await withTransaction(async (client) => {
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file])
    })
    logger.info({ migration: file }, 'applied migration')
  }
  return pending
}

// Allow `node src/db/migrate.js` as well as importing it from the bootstrap.
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  migrate()
    .then(() => closePool())
    .catch((err) => {
      logger.error({ err }, 'migration failed')
      process.exitCode = 1
      return closePool()
    })
}
