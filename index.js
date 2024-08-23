import fs from 'fs';
import express from 'express';
import path from 'path';

const port = process.env.PORT || 5001;
const __dirname = path.resolve();
const app = express();
const baseFolder = `${__dirname}/data`;
const tournamentsFolder = `${baseFolder}/tournaments`;

const runningTournaments = ['0000128'];

const createFolder = () => {
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
    res.send(`Tournament ${tournamentId} is running`);
  } else {
    res.send({});
  }
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

// const getTournamentDivisionData = async tournamentId => {
//   const url = `${baseUrl}/${tournamentId}`;
//   let options = {};
//   options.redirect = 'follow';
//   options.follow = 20;
//   try {
//     const response = await fetch(url, options);
//     const data = await response.json();
//     if (Object.keys(data).length === 0) {
//       return;
//     }

//     fs.writeFile(`${folderName}/${tournamentId}.json`, JSON.stringify(data), err => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

const createTestFile = () => {
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

app.listen(port, () => {
  createFolder();
  createTestFile();
  console.log(`Server is running on port ${port}`);
});
