import { NextApiRequest, NextApiResponse } from 'next';
import { pipeline } from '@xenova/transformers';
import fs from 'fs';
import os from 'os';
import path from 'path';
import youtubedl from 'youtube-dl-exec';

interface GenerateTextRequest extends NextApiRequest {
    query: {
        youtubeUrl: string;
    };
}

export default async function handler(
    req: GenerateTextRequest,
    res: NextApiResponse
) {
    const youtubeUrl = req.query.youtubeUrl;

    if (!youtubeUrl || typeof youtubeUrl !== 'string') {
        return res.status(400).json({ error: 'youtubeUrl is required in request body' });
    }

    const outputFile = path.join(os.tmpdir(), `youtube-audio-${Date.now()}.m4a`);

    try {
        // 1. Baixa apenas o melhor áudio disponível (sem conversão externa)
        await youtubedl(youtubeUrl, {
            output: outputFile,
            format: 'bestaudio',
            quiet: true,
            jsRuntimes: 'node',
        });

        // 2. Transcreve com Whisper
        const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
        const transcript = await transcriber(outputFile) as { text: string };

        return res.status(200).json(transcript.text);
    } catch (error: any) {
        console.error('generateTranscription error:', error);
        return res.status(500).json({ error: `Error generating transcription: ${error?.message ?? 'unknown error'}` });
    } finally {
        try {
            if (fs.existsSync(outputFile)) {
                fs.unlinkSync(outputFile);
            }
        } catch (cleanupError) {
            console.warn('Failed to remove temporary audio file:', cleanupError);
        }
    }
}