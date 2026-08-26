import type { NextApiRequest, NextApiResponse } from 'next'
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

type Data = {
  info: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ info: 'GOOGLE_API_KEY não configurada' });
  }

  try {
    const { text } = await generateText({
      model: googleClient('gemini-2.5-flash'),
      prompt: 'Explique sobre o changelog do Next.js 15',
    });

    res.status(200).json({ info: text });
  } catch (error: any) {
    console.error('Google generateText error:', error);
    res.status(500).json({ info: `Error generating text: ${error?.message ?? 'unknown error'}` });
  }
}
