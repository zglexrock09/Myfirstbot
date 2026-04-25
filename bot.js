import 'dotenv/config'
import { Telegraf } from 'telegraf'
import { connectWA, logoutWA, getStatus, updateConfig } from './wa-engine.js'

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.command('login', async ctx => {
  const phone = ctx.message.text.split(' ')[1]?.trim();
  if (!phone) return ctx.reply('Format: /login 628xxxxxxxxx');
  ctx.reply('Pairing device... Tunggu muncul kode pairing.');
  const code = await connectWA(ctx.from.id, phone)
  if (code) {
    ctx.reply(Buka WhatsApp > Linked Devices > Link a Device > Pair with code, lalu masukkan kode berikut:\n\n*${code}*, { parse_mode: "Markdown" })
  } else {
    ctx.reply('Gagal mengambil kode pairing. Coba ulang beberapa saat lagi.')
  }
})

bot.command('logout', async ctx => {
  const phone = ctx.message.text.split(' ')[1]?.trim();
  if (!phone) return ctx.reply('Format: /logout 628xxxxxxxxx');
  await logoutWA(ctx.from.id, phone)
  ctx.reply(Logout untuk nomor ${phone} diproses)
})

bot.command('status', async ctx => {
  const stats = await getStatus(ctx.from.id)
  if (!stats.length) return ctx.reply('Tidak ada sesi aktif.');
  let msg = stats.map(s => ${s.number} (${s.status}) — ${s.up_minutes} menit).join('\n')
  ctx.reply(msg)
})

// Fitur panel
bot.hears(/\/autojoingc (on|off)/, async ctx => {
  await updateConfig(ctx.from.id, null, { autojoingc: ctx.match[1] === 'on' })
  ctx.reply('autojoingc diperbarui.')
})
bot.hears(/\/autochatgc (on|off)/, async ctx => {
  await updateConfig(ctx.from.id, null, { autochatgc: ctx.match[1] === 'on' })
  ctx.reply('autochatgc diperbarui.')
})
bot.hears(/\/setchatgc (.+)/, async ctx => {
  await updateConfig(ctx.from.id, null, { chatgc_text: ctx.match[1] })
  ctx.reply('Isi pesan grup diubah.')
})
bot.hears(/\/autochatpm (on|off)/, async ctx => {
  await updateConfig(ctx.from.id, null, { autochatpm: ctx.match[1] === 'on' })
  ctx.reply('autochatpm diperbarui.')
})
bot.hears(/\/setchatpm (.+)/, async ctx => {
  await updateConfig(ctx.from.id, null, { chatpm_texts: ctx.match[1].split('|') })
  ctx.reply('Isi balasan PM diset.')
})
bot.hears(/\/setdelaygc (\d+)/, async ctx => {
  await updateConfig(ctx.from.id, null, { delay_gc: Number(ctx.match[1]) })
  ctx.reply('Delay grup diubah.')
})
bot.hears(/\/setdelaypm (\d+)/, async ctx => {
  await updateConfig(ctx.from.id, null, { delay_pm: Number(ctx.match[1]) })
  ctx.reply('Delay PM diubah.')
})

bot.launch()
console.log('Telegram bot running...')