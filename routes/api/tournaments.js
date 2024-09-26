import express from 'express';
import fs from 'fs';
const router = express.Router();

import { baseFolder, tournamentsFolder } from '../../constants/folders.js';

router.get('/', (req, res) => {
  console.log('Request for tournaments data');
  fs.readFile(`${baseFolder}/tournaments.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(JSON.parse(data));
  });
});

router.get('/:tournamentId', (req, res) => {
  const { tournamentId } = req.params;
  console.log(`Request for tournament ${tournamentId}`);
  fs.readFile(`${tournamentsFolder}/${tournamentId}.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.send({});
    }
    res.send(JSON.parse(data));
  });
});

export default router;
