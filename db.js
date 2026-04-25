import { Low, JSONFile } from 'lowdb'
const db = new Low(new JSONFile('db.json'))

await db.read()
db.data ||= { users: [] }

export default {
  saveSession(tg_id, phone) {
    let user = db.data.users.find(u => u.tg_id === tg_id)
    if (!user) {
      user = { tg_id, wa_sessions: [] }
      db.data.users.push(user)
    }
    if (!user.wa_sessions.find(s => s.number === phone))
      user.wa_sessions.push({ number: phone, connected: true, last_update: Date.now(), config: {} })
    db.write()
  },
  removeSession(tg_id, phone) {
    let user = db.data.users.find(u => u.tg_id === tg_id)
    if (!user) return
    user.wa_sessions = user.wa_sessions.filter(s => s.number !== phone)
    db.write()
  },
  getUserSessions(tg_id) {
    let user = db.data.users.find(u => u.tg_id === tg_id)
    return user ? user.wa_sessions : []
  },
  getConfig(tg_id, phone, key) {
    let user = db.data.users.find(u => u.tg_id === tg_id)
    if (!user) return null
    let sess = user.wa_sessions.find(s => !phone || s.number === phone)
    return sess?.config?.[key]
  },
  updateUserConfig(tg_id, phone, conf) {
    let user = db.data.users.find(u => u.tg_id === tg_id)
    if (!user) return
    let sess = user.wa_sessions.find(s => !phone || s.number === phone)
    if (!sess) return
    Object.assign(sess.config, conf)
    sess.last_update = Date.now()
    db.write()
  }
}