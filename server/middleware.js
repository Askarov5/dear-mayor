import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const authUrl = process.env.VITE_AUTH_API_URL;
const clientId = process.env.VITE_AUTH_CLIENT_ID;
const clientSecret = process.env.VITE_AUTH_CLIENT_SECRET;
const scope = process.env.VITE_AUTH_SCOPE;
const grant_type = process.env.VITE_AUTH_GRANT_TYPE;


export const startMiddleware = () => {
    console.log('middleware.js');
    const app = express();

    const corsOptions = {
        origin: "https://dear-mayor.vercel.app", // This should match your front end's URL
        credentials: true,
    };

    app.use(cors(corsOptions));

    app.get('/', async (req, res) => {
        await res.send('WELCOME TO DEAR MAYOR MIDDLEWARE');
    });

    app.post('/oauth2/v2.0/token', async (req, res) => {

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
        })

        return await res.json(await response.json());
    });

    const PORT = process.env.PORT || 5000; // You can specify the port here
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}

startMiddleware();

