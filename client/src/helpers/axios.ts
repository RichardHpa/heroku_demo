import rawAxios from 'axios';

export const axios = rawAxios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
