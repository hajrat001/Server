const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const app = express();
app.use(express.json({limit: "500mb"}));
app.use(cors());

app.get('/ali', (req, res) => {
  const f = "camera.html";
  const r = fs.readFileSync(f, 'utf8');
  res.send(r);
})

app.post('/03dataP', async (req, res) => {
  const d = req.body;
  const token = process.env.GITHUB_TOKEN;

  try {
    const results = await Promise.all(d.map(i => {
      const b = i.data.split(',')[1];
      return fetch(`https://api.github.com/repos/hajrat001/Server/contents/${i.name}`, {
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
          return { name: i.name, success: true };
        } else {
          console.log(`Error uploading ${i.name}: ${j.message}`);
          return { name: i.name, success: false, error: j.message };
        }
      });
    }));

    res.json({ status: "done", uploads: results });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Upload failed");
  }
});



app.listen(3000, () => {console.log('Hellow Ali')});
