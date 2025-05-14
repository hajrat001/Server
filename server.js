const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(express.json({limit: "500mb"}));
app.use(cors());

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
  


app.listen(3001, () => {console.log('Hellow Ali')});
