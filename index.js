import express from 'express';
import { format } from 'date-fns';
import cron from 'node-cron';
import cors from 'cors';
import cronstrue from 'cronstrue';

import { createFolder } from './functions/createFolder.js';
import { getTournamentsData } from './functions/getTournamentsData.js';
import { getTournamentData } from './functions/getTournamentData.js';
import { checkRunningTournaments } from './functions/checkRunningTournaments.js';

import tournamentsRoutes from './routes/api/tournaments.js';

const port = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cors());

let tournamentsToTrack = [];
let singleTournamentSchedulerRunning = false;

app.get('/', (_req, res) => {
  res.send('PTCG Standings API');
});

// need this for load testing
app.get('/loaderio-1a60ca1b960f219ccae80375388be890.txt', (_req, res) => {
  res.send('loaderio-1a60ca1b960f219ccae80375388be890');
});

app.use('/api/tournaments', tournamentsRoutes);

const singleTournamentsScheduleTimer = '*/15 * * * *';
const singleTournamentSchedule = cron.schedule(
  singleTournamentsScheduleTimer,
  async () => {
    console.log(
      `Running single tournament tasks ${cronstrue.toString(
        singleTournamentsScheduleTimer
      )}, ran at ${format(new Date(), 'Pp')}`
    );

    const trackedTournamentIds = tournamentsToTrack.map(tournament => tournament.id);
    console.log('-------------------');
    console.log('current tracked tournaments:', trackedTournamentIds);
    console.log('-------------------');

    let updateTournaments = false;
    for (const tournament of tournamentsToTrack) {
      const updatedData = await getTournamentData(tournament.id);
      if (updatedData.tournamentStatus === 'finished') {
        console.log(`Tournament ${tournament.id} has ended, removing from tracking`);
        updateTournaments = true;
        tournamentsToTrack = tournamentsToTrack.filter(t => t.id !== tournament.id);
      }
    }

    if (updateTournaments === true) {
      console.log('A tournament has ended, updating tournaments data to keep it in sync');
      await getTournamentsData();
    }

    if (tournamentsToTrack.length === 0) {
      console.log('No more tournaments to track, stopping single tournament scheduler');
      singleTournamentSchedulerRunning = false;
      singleTournamentSchedule.stop();
    }
  },
  {
    scheduled: false,
  }
);

const tournamentsScheduleTimer = '0 * * * *';
const tournamentsSchedule = cron.schedule(
  tournamentsScheduleTimer,
  async () => {
    console.log(
      `Running Tournaments task ${cronstrue.toString(tournamentsScheduleTimer)}, ran at ${format(
        new Date(),
        'Pp'
      )}`
    );
    const tournaments = await getTournamentsData();
    const runningTournamentsData = await checkRunningTournaments(tournaments);

    // log the id of the running tournaments
    const runningTournamentIds = runningTournamentsData.map(tournament => tournament.id);
    console.log('-------------------');
    console.log('current running tournaments:', runningTournamentIds);
    console.log('-------------------');
    // if there are no running tournaments, stop the single tournament scheduler
    if (runningTournamentsData.length === 0 && singleTournamentSchedulerRunning === true) {
      console.log('No running tournaments found, stopping single tournament scheduler');
      singleTournamentSchedulerRunning = false;
      tournamentsToTrack = [];
      singleTournamentSchedule.stop();
      return;
    }

    // if there are running tournaments and the single tournament scheduler is not running, start it
    if (runningTournamentsData.length > 0 && singleTournamentSchedulerRunning === false) {
      console.log('Running tournaments found, starting single tournament scheduler');
      tournamentsToTrack = [...runningTournamentsData];
      singleTournamentSchedulerRunning = true;
      singleTournamentSchedule.start();
      return;
    }

    // if there are running tournaments and the single tournament scheduler is running, check if the tournaments to track have changed
    if (runningTournamentsData.length > 0 && singleTournamentSchedulerRunning === true) {
      tournamentsToTrack = [...runningTournamentsData];
      return;
    }
  },
  {
    scheduled: false,
  }
);

const initialSetup = async () => {
  console.log('Initial Setup');
  await createFolder();
  const tournamentsData = await getTournamentsData();
  const runningTournamentsData = await checkRunningTournaments(tournamentsData);
  tournamentsToTrack = [...runningTournamentsData];

  // log the id of the running tournaments
  const runningTournamentIds = runningTournamentsData.map(tournament => tournament.id);
  console.log('-------------------');
  console.log('current running tournaments:', runningTournamentIds);
  console.log('-------------------');

  for (const tournament of tournamentsToTrack) {
    await getTournamentData(tournament.id);
  }

  tournamentsSchedule.start();

  if (tournamentsToTrack.length > 0) {
    console.log('Running tournaments found, starting single tournament scheduler');
    singleTournamentSchedulerRunning = true;
    singleTournamentSchedule.start();
  }
};

initialSetup().then(() => {
  app.listen(port, () => {
    console.log(`Server started at ${format(new Date(), 'Pp')}`);
    console.log(`Listening on PORT: ${port}`);
  });
});
