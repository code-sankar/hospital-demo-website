import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'
import { config } from '../config.js'
import { logger } from '../lib/logger.js'

const mailboxDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '.mailbox')

let transport

/**
 * `file` writes each message to server/.mailbox as an .eml you can open in any
 * mail client — the whole ticket flow is reviewable without an SMTP account.
 * `smtp` sends for real.
 */
function getTransport() {
  if (transport) return transport

  if (config.mail.transport === 'smtp') {
    const { host, port, secure, user, pass } = config.mail.smtp
    if (!host) throw new Error('MAIL_TRANSPORT=smtp but SMTP_HOST is not set.')
    transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user ? { user, pass } : undefined,
    })
  } else {
    transport = nodemailer.createTransport({ jsonTransport: true })
  }
  return transport
}

export async function sendMail({ to, subject, html, text, headers }) {
  const message = { from: config.mail.from, to, subject, html, text, headers }
  const info = await getTransport().sendMail(message)

  if (config.mail.transport !== 'smtp' && !config.isTest) {
    await mkdir(mailboxDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const safe = subject.replace(/[^a-z0-9]+/gi, '-').slice(0, 60)
    await writeFile(join(mailboxDir, `${stamp}-${safe}.eml`), info.message ?? JSON.stringify(message, null, 2), 'utf8')
    logger.info({ to, subject }, 'email written to server/.mailbox')
  }

  return { messageId: info.messageId ?? `local-${Date.now()}` }
}
