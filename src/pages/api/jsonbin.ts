import type { NextApiRequest, NextApiResponse } from 'next'
import Axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = process.env.JSONBIN_KEY_MASTER
  const binId = process.env.JSONBIN_ID_SUBS

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
  } catch (error) {
    return res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'Erro ao buscar jsonbin' })
  }
}
