const getAuthToken = async () => {
  const authUrl = import.meta.env.VITE_AUTH_API_URL;
  const clientId = import.meta.env.VITE_AUTH_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_AUTH_CLIENT_SECRET;
  const scope = import.meta.env.VITE_AUTH_SCOPE;
  const grant_type = import.meta.env.VITE_AUTH_GRANT_TYPE;

  if (!authUrl || !clientId || !clientSecret || !scope) {
    throw new Error('Missing required environment variables');
  }

  try {
    const response = await fetch(`${authUrl}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
      },
      body: new URLSearchParams({
        grant_type: grant_type as string,
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Error requesting auth token: ${response.statusText}`);
    }

    const data = await response.json();
    process.env.AUTH_TOKEN = data.access_token;
    return data.access_token;
  } catch (error) {
    console.error('Error requesting auth token:', error);
    throw error;
  }
};

export default getAuthToken;
