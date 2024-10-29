import express from 'express';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const authUrl = process.env.VITE_AUTH_API_URL as string;
const clientId = process.env.VITE_AUTH_CLIENT_ID as string;
const clientSecret = process.env.VITE_AUTH_CLIENT_SECRET as string;
const scope = process.env.VITE_AUTH_SCOPE as string;
const grant_type = process.env.VITE_AUTH_GRANT_TYPE as string;

console.log('middleware.ts');
const app = express();

const corsOptions = {
    origin: "http://localhost:5173", // This should match your front end's URL
    credentials: true,
};

app.use(cors(corsOptions));

app.get('/', async (req: Request, res: Response) => {
    await res.send('WELCOME TO DEAR MAYOR MIDDLEWARE');
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.post('/oauth2/v2.0/token', async (_req: any, res: any) => {
    if (!authUrl || !clientId || !clientSecret || !scope) {
        throw new Error('Missing required environment variables');
    }

    const response = await fetch(`${authUrl}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: grant_type,
            client_id: clientId,
            client_secret: clientSecret,
            scope: scope,
        }).toString(),
    });

    const jsonResponse = await response.json();
    return res.json(jsonResponse);
});

const PORT = process.env.PORT || 5000; // You can specify the port here
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
