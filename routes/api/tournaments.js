import express from 'express';
import fs from 'fs';
const router = express.Router();

import { baseFolder, tournamentsFolder } from '../../constants/folders.js';
import { getTournamentData } from '../../functions/getTournamentData.js';

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

router.get('/:tournamentId', async (req, res) => {
  const { tournamentId } = req.params;
  const file = `${tournamentsFolder}/${tournamentId}.json`;

  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(404).send(`Tournament ${tournamentId} not found`);
      } else {
        res.send(JSON.parse(data));
      }
    });
  } else {
    console.log('file does not exist, fetching data');
    const tournament = await getTournamentData(tournamentId);
    if (tournament) {
      res.send(tournament);
    } else {
      res.status(404).send(`Tournament ${tournamentId} not found`);
    }
  }
});

export default router;
