import express from 'express';
const port = process.env.port || 5001;

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
