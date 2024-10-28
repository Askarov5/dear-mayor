const getAuthToken = async () => {
  const authUrl = import.meta.env.VITE_AUTH_MIDDLEWARE_URL;
 
  try {
    const response = await fetch(`${authUrl}/oauth2/v2.0/token`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error(`Error requesting auth token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error requesting auth token:', error);
    throw error;
  }
};

export default getAuthToken;
