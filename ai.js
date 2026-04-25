import { Configuration, OpenAIApi } from 'openai'

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_KEY }))

export async function randomizeAI(arr) {
  if (!arr?.length) return ''
  if (arr.length === 1 || Math.random() < 0.7) return arr[Math.floor(Math.random() * arr.length)]
  const base = arr[Math.floor(Math.random() * arr.length)]
  // Using OpenAI for paraphrasing, fallback to original
  try {
    const out = await openai.createChatCompletion({
      messages: [{ role: 'user', content: Buat variasi, singkat/panjang lain dari: "${base}". Tidak perlu basa-basi, langsung kalimat hasil. }],
      model: 'gpt-3.5-turbo',
      max_tokens: 40,
      temperature: 0.8
    })
    return out.data.choices?.[0]?.message?.content?.trim() || base
  } catch (e) {
    return base
  }
}