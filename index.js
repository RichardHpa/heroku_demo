import fs from 'fs';
import express from 'express';
import path from 'path';
import { format } from 'date-fns';
import cron from 'node-cron';

const port = process.env.PORT || 5001;
const __dirname = path.resolve();
const app = express();
const baseFolder = `${__dirname}/data`;
const tournamentsFolder = `${baseFolder}/tournaments`;

const runningTournaments = ['0000129'];

const createFolder = async () => {
  if (!fs.existsSync(tournamentsFolder)) {
    fs.mkdirSync(tournamentsFolder, { recursive: true });
  }
};

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

const baseUrl = `https://www.pokedata.ovh/apiv2/division/masters+juniors+seniors/tcg/id`;
app.get(`/tournaments/:tournamentId`, (req, res) => {
  const { tournamentId } = req.params;
  if (runningTournaments.includes(tournamentId)) {
    fs.readFile(`${tournamentsFolder}/${tournamentId}.json`, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.send({});
      }
      res.send(JSON.parse(data));
    });
  } else {
    res.send({});
  }
});

app.get('/tournaments', (_req, res) => {
  fs.readFile(`${baseFolder}/tournaments.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(JSON.parse(data));
  });
});

app.get('/test', (_req, res) => {
  fs.readFile(`${baseFolder}/test.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(JSON.parse(data));
  });
});

app.get('/loaderio-1a60ca1b960f219ccae80375388be890.txt', (_req, res) => {
  res.send('loaderio-1a60ca1b960f219ccae80375388be890');
});

const schedule = cron.schedule(
  '*/15 * * * *',
  async () => {
    console.log(`Running task every 15 minutes, ran at ${format(new Date(), 'Pp')}`);
    await getTournamentDivisionData(runningTournaments[0]);
  },
  {
    scheduled: false,
  }
);

const tournamentsSchedule = cron.schedule(
  '0 * * * *',
  async () => {
    console.log(`Running task every hour, ran at ${format(new Date(), 'Pp')}`);
    await getTournamentsData();
  },
  {
    scheduled: false,
  }
);

const tournamentsUrl = 'https://www.pokedata.ovh/apiv2/tcg/tournaments';
const getTournamentsData = async () => {
  const url = tournamentsUrl;
  let options = {};
  options.redirect = 'follow';
  options.follow = 20;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (Object.keys(data).length === 0) {
      console.log('No data found');
      return;
    }
    const date = format(new Date(), 'Pp');
    const newData = {
      dataLastUpdated: date,
      ...data,
    };

    fs.writeFile(`${baseFolder}/tournaments.json`, JSON.stringify(newData, null, 4), err => {
      console.log(`Tournaments Data updated at ${date} and file saved`);

      if (err) {
        console.error(err);
        return;
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const getTournamentDivisionData = async tournamentId => {
  const url = `${baseUrl}/${tournamentId}`;
  let options = {};
  options.redirect = 'follow';
  options.follow = 20;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (Object.keys(data).length === 0) {
      console.log('No data found');
      return;
    }
    const date = format(new Date(), 'Pp');
    const newData = {
      dataLastUpdated: date,
      ...data,
    };

    fs.writeFile(
      `${tournamentsFolder}/${tournamentId}.json`,
      JSON.stringify(newData, null, 4),
      err => {
        console.log(`Data for ${tournamentId} updated at ${date} and file saved`);
        if (data.tournament.tournamentStatus === 'finished') {
          schedule.stop();
          console.log(`Tournament ${tournamentId} has finished, stopping schedule`);
        }
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const createTestFile = async () => {
  const data = {
    test: 'test',
  };

  fs.writeFile(`${baseFolder}/test.json`, JSON.stringify(data), err => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

const initialSetup = async () => {
  console.log('Initial Setup');
  await createFolder();
  await createTestFile();
  await getTournamentsData();
  await getTournamentDivisionData(runningTournaments[0]);
};

initialSetup().then(() => {
  app.listen(port, () => {
    console.log(`Server started at ${format(new Date(), 'Pp')}`);
    console.log(`Listening on PORT: ${port}`);
    schedule.start();
    tournamentsSchedule.start();
  });
});
