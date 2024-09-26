import fs from 'fs';
import { tournamentsFolder } from '../constants/folders.js';

export const createFolder = async () => {
  if (!fs.existsSync(tournamentsFolder)) {
    fs.mkdirSync(tournamentsFolder, { recursive: true });
  } else {
    console.log('Tournaments folder already exists');
  }
};
