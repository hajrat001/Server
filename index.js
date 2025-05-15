const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config(); // .env file ke liye

const app = express();
app.use(express.json({ limit: "500mb" }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>hii ali</h1>');
});

app.post('/01dataP', async (req, res) => {
  const newData = req.body;
  const token = process.env.GITHUB_TOKEN;

  const url = 'https://api.github.com/repos/hajrat001/Data/contents/JsonData/01data.json';

  try {
    // Step 1: Get existing file
    const getRes = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const getData = await getRes.json();
    const sha = getData.sha;
    const existingContent = JSON.parse(Buffer.from(getData.content, 'base64').toString('utf-8'));

    // Step 2: Combine old + new data
    const updatedContent = [...existingContent, ...newData];

    // Step 3: PUT updated file
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: 'Update via backend',
        content: Buffer.from(JSON.stringify(updatedContent, null, 2)).toString('base64'),
        sha: sha
      })
    });

    const putData = await putRes.json();
    if (putRes.ok) {
      res.send('done');
    } else {
      res.status(500).send(putData);
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.listen(3000, () => {
  console.log('Hellow Ali');
});