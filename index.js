const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const app = express();
app.use(express.json({limit: "500mb"}));
app.use(cors());

app.get('/', (req, res) => {
  const f = "camera.html";
  const r = fs.readFileSync(f, 'utf8');
  res.send(r);
})
app.get('/shama', (req, res) => {
  const f = "data/shama.json";
  const r = fs.readFileSync(f, 'utf8');
  res.send(r);
})
app.get('/saba', (req, res) => {
  const f = "data/saba.json";
  const r = fs.readFileSync(f, 'utf8');
  res.send(r);
})
app.get('/01data', (req, res) => {
  const f = "data/01data.json";
  const r = fs.readFileSync(f, 'utf8');
  res.send(r);
})
app.get('/02data', (req, res) => {
  const f = "data/02data.json";
  const r = fs.readFileSync(f, 'utf8');
  res.send(r);
})




app.post('/01dataP', (req, res) => {
  const f = "data/01data.json";
  const d = req.body;
  let old = [];
  try { old = JSON.parse(fs.readFileSync(f, 'utf8')) } catch {}
  fs.writeFile(f, JSON.stringify([...old, ...d], null, 2), err => {
    if (err) return res.status(500).send('fail');
    res.send('done');
  });
});
app.post('/02dataP', (req, res) => {
  const f = "data/02data.json";
  const d = req.body;
  let old = [];
  try { old = JSON.parse(fs.readFileSync(f, 'utf8')) } catch {}
  fs.writeFile(f, JSON.stringify([...old, ...d], null, 2), err => {
    if (err) return res.status(500).send('fail');
    res.send('done');
  });
});
app.post('/03dataP', (req, res) => {
  const d = req.body;
  const token = process.env.GITHUB_TOKEN;

  d.forEach(i => {
    let b = i.data.split(',')[1];

    fetch(`https://api.github.com/repos/hajrat001/Server/contents/${i.name}`, {
      method: "PUT",
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `upload ${i.name}`,
        content: b,
        encoding: 'base64'
      })
    })
    .then(r => r.json())
    .then(j => {
      if (j.content) {
        console.log(`${i.name} uploaded`);
      } else {
        console.log(`Error: ${j.message}`);
      }
    })
    .catch(err => console.error(`Fetch error: ${err}`));
  });

  res.send("Upload process started...");
});



app.listen(3000, () => {console.log('Hellow Ali')});