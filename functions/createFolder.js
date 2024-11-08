import fs from 'fs';
import { tournamentsFolder } from '../constants/folders.js';

export const createFolder = async () => {
  if (!fs.existsSync(tournamentsFolder)) {
    fs.mkdirSync(tournamentsFolder, { recursive: true });
  } else {
    console.log('Tournaments folder already exists');
  }

  if (!fs.existsSync(`${tournamentsFolder}/old`)) {
    fs.mkdirSync(`${tournamentsFolder}/old`, { recursive: true });
  } else {
    console.log('Old tournaments folder already exists');
  }
};
