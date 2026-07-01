import type { NextApiRequest, NextApiResponse } from 'next'
import Axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = process.env.TOKEN_DEVFINDER
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  try {
    const { data } = await Axios.post(`${apiUrl}/video/refresh`, req.body, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.status(200).json(data)
  } catch (error: any) {
    return res.status(500).json({ error: error?.message ?? 'Erro ao atualizar vídeos' })
  }
}
