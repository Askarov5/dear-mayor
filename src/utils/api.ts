const BASE_API_URL = import.meta.env.VITE_API_BASE_URL as string;

const apiExtention = import.meta.env.PROD ? '' : '/api';

export const getFullUrl = (endpoint: string): string => {
  return `${BASE_API_URL}${apiExtention}${endpoint}`;
};