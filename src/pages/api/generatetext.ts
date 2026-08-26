import type { NextApiRequest, NextApiResponse } from 'next'
import { generateText } from 'ai';

//import { createOpenAI } from '@ai-sdk/openai';
//import { createDeepSeek } from '@ai-sdk/deepseek';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

/*const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const deepseekClient = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '') + '/v1',
});*/

const groqClient = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const modelMap = {
  /*openai: {
    client: () => openaiClient('gpt-4o-mini'),
    env: 'OPENAI_API_KEY',
  },
  deepseek: {
    client: () => deepseekClient('deepseek-v3'),
    env: 'DEEPSEEK_API_KEY',
  },*/
  groq: {
    client: () => groqClient('openai/gpt-oss-20b'),
    env: 'GROQ_API_KEY',
  },
  google: {
    client: () => googleClient('gemini-2.5-flash'),
    env: 'GOOGLE_API_KEY',
  },
} as const;

type ModelProvider = keyof typeof modelMap;

type Body = {
  prompt: string;
  model: ModelProvider;
  youtubeUrl?: string;
}

interface GenerateTextRequest extends NextApiRequest {
  body: Body;
}

type ResponseData = {
  info: string
}

export default async function handler(
  req: GenerateTextRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log('/api/generatetext - request body:', req.body);
  const modelParam = req.body.model;
  const prompt = req.body.prompt;

  const selected = modelMap[modelParam as keyof typeof modelMap];

  if (!process.env[selected.env]) {
    return res.status(500).json({ info: `${selected.env} não configurada` });
  }

  try {
    const { text } = await generateText({
      model: selected.client(),
      prompt
    });

    /*const { text } = await generateText({
      model: googleClient('gemini-2.0-flash-lite'), // O 'pro' é mais preciso para falas complexas
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Transcreva',
            },
            {
              type: 'file',
              data: req.body.youtubeUrl,
              mediaType: 'video/mp4',
            },
          ],
        },
      ],
    });*/

    res.status(200).json({ info: text });
  } catch (error: any) {
    console.error('generateText error:', error);
    return res.status(500).json({ info: `Error generating text: ${error?.message ?? 'unknown error'}` });
  }
}
