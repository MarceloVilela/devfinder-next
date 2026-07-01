import type { NextApiRequest, NextApiResponse } from 'next'
import Axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = process.env.NEXT_PUBLIC_JSONBIN_KEY_MASTER
  const binId = process.env.NEXT_PUBLIC_JSONBIN_ID_SUBS

  if (!token || !binId) {
    return res
      .status(500)
      .json({ error: 'JSONBIN_KEY_MASTER ou JSONBIN_ID_SUBS não configurados' })
  }

  try {
    const { data } = await Axios.get(`https://api.jsonbin.io/v3/b/${binId}`, {
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': token },
    })
    return res.status(200).json(data.record)
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error?.message ?? 'Erro ao buscar jsonbin' })
  }
}
