// use full url in production, relative url in development
// dev uses proxy to avoid CORS issues
const BASE_API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL
  : '/api';

export const getFullUrl = (endpoint: string): string => {
  return `${BASE_API_URL}${endpoint}`;
};
