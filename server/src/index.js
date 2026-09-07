import { createApp } from './app.js'
import { config } from './config.js'
import { logger } from './lib/logger.js'
import { closePool } from './db/pool.js'
import { migrate } from './db/migrate.js'
import { sweepExpiredHolds } from './services/slots.js'

const app = createApp()

// Migrations run at boot so a fresh Supabase project only needs the connection
// string; there is no separate deploy step to forget.
await migrate()

const server = app.listen(config.port, () => {
  logger.info(
    { port: config.port, env: config.env, payments: config.payments.provider, mail: config.mail.transport },
    'Ashvini API listening',
  )
})

// Abandoned checkouts are also swept lazily on read, but a timer keeps the
// calendar tidy for anyone looking at it between requests.
const sweeper = setInterval(() => {
  sweepExpiredHolds().catch((err) => logger.error({ err }, 'hold sweep failed'))
}, 60_000)
sweeper.unref()

const shutdown = async (signal) => {
  logger.info({ signal }, 'shutting down')
  clearInterval(sweeper)
  server.close(async () => {
    await closePool()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
