import rawAxios from 'axios';

export const axios = rawAxios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});
