import { Client, LocalAuth } from 'whatsapp-web.js'
import { randomizeAI } from './ai.js'
import db from './db.js'

const sessions = {}

export async function connectWA(tg_id, phone) {
  // Only create if not exists
  if (sessions[phone] && sessions[phone].isReady) return null
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: phone }),
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    webVersionCache: { type: 'remote' }
  })
  sessions[phone] = client
  let pairingCode
  let resolvePairing
  const pairingPromise = new Promise((resolve) => { resolvePairing = resolve })

  client.on('pairing-code', code => {
    pairingCode = code;
    resolvePairing(code)
  })

  client.on('ready', () => {
    db.saveSession(tg_id, phone)
    sessions[phone].isReady = true
  })

  client.on('message', async msg => {
    if (
      msg.from.endsWith('@c.us') &&
      db.getConfig(tg_id, phone, 'autochatpm') &&
      Array.isArray(db.getConfig(tg_id, phone, 'chatpm_texts'))
    ) {
      let balasan = await randomizeAI(db.getConfig(tg_id, phone, 'chatpm_texts'))
      await msg.reply(balasan)
      await new Promise(res => setTimeout(res, (db.getConfig(tg_id, phone, 'delay_pm') || 60) * 1000))
    }
  })

  // Auto chat group by interval
  setInterval(async () => {
    if (!db.getConfig(tg_id, phone, 'autochatgc')) return
    let chatgcText = db.getConfig(tg_id, phone, 'chatgc_text')
    if (!chatgcText) return
    let groupChats = await client.getChats()
    groupChats = groupChats.filter(c => c.isGroup)
    for (const grp of groupChats) {
      let chat = await randomizeAI([chatgcText])
      await client.sendMessage(grp.id._serialized, chat)
      await new Promise(res => setTimeout(res, (db.getConfig(tg_id, phone, 'delay_gc') || 180) * 1000))
    }
  }, 90 * 1000)

  await client.initialize()
  return pairingCode || await pairingPromise
}

export async function logoutWA(tg_id, phone) {
  if (!sessions[phone]) return
  await sessions[phone].destroy()
  db.removeSession(tg_id, phone)
  delete sessions[phone]
}

export async function getStatus(tg_id) {
  let s = db.getUserSessions(tg_id)
  if (!s) return []
  return s.map(sess => ({
    number: sess.number,
    status: sess.connected ? 'CONNECTED' : 'DISCONNECTED',
    up_minutes: Math.floor((Date.now() - sess.last_update) / 60000)
  }))
}

export async function updateConfig(tg_id, phone, configObj) {
  db.updateUserConfig(tg_id, phone, configObj)
}