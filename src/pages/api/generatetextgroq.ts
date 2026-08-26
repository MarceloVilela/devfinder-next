import type { NextApiRequest, NextApiResponse } from 'next'
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

// Configuramos o cliente Groq
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

type Data = {
  info: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('GROQ_API_KEY encontrada:', !!process.env.GROQ_API_KEY);

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ info: 'GROQ_API_KEY não configurada' });
  }

  try {
    const { text } = await generateText({
      model: groq('openai/gpt-oss-20b'),
      prompt: 'Explique sobre o changelog do Next.js 15',
    });

    res.status(200).json({ info: text })
  } catch (error) {
    console.error('Error generating text:', error);
    console.error('Error details:', error);
    res.status(500).json({ info: `Error generating text` });
  }
}