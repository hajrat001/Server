const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(express.json({limit: "500mb"}));
app.use(cors());

app.grt('/', (req, res) => {
  res.send('<h1>hii ali</h1>');
})

app.listen(3000, () => {console.log('Hellow Ali')});