import { Supadata } from '@supadata/js';
import { NextApiRequest, NextApiResponse } from 'next';

interface GenerateTextRequest extends NextApiRequest {
    query: {
        youtubeUrl: string;
    };
    body: {
        youtubeUrl?: string;
    };
}

export default async function handler(
    req: GenerateTextRequest,
    res: NextApiResponse
) {
    const youtubeUrl = req.body.youtubeUrl || req.query.youtubeUrl;

    if (!youtubeUrl || typeof youtubeUrl !== 'string') {
        return res.status(400).json({ error: 'youtubeUrl is required in request body' });
    }

    if (!process.env.SUPA_API_KEY) {
        return res.status(400).json({ error: 'SUPA_API_KEY is not configured' });
    }

    // Initialize the client
    const supadata = new Supadata({
        apiKey: process.env.SUPA_API_KEY,
    });

    // Get transcript from any supported platform (YouTube, TikTok, Instagram, X (Twitter)) or file
    const transcriptResult = await supadata.transcript({
        url: youtubeUrl,
        lang: "pt", // optional
        text: true, // optional: return plain text instead of timestamped chunks
        mode: "auto", // optional: 'native', 'auto', or 'generate'
    });

    // Check if we got a transcript directly or a job ID for async processing
    if ("jobId" in transcriptResult) {
        // For large files, we get a job ID and need to poll for results
        console.log(`Started transcript job: ${transcriptResult.jobId}`);

        // Poll for job status
        const jobResult = await supadata.transcript.getJobStatus(
            transcriptResult.jobId
        );
        if (jobResult.status === "completed") {
            console.log("Transcript:", jobResult.result?.content);
        } else if (jobResult.status === "failed") {
            console.error("Transcript failed:", jobResult.error);
        } else {
            console.log("Job status:", jobResult.status); // 'queued' or 'active'
        }
    } else {
        // For smaller files, we get the transcript directly
        console.log("Transcript:", transcriptResult);
    }

    return res.status(200).json(transcriptResult);
}