import axios from 'axios';

// This creates a central axios instance that knows where your backend is.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
});

export default api;