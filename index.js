const express = require('express');
const bodyParser = require('body-parser');
const posts = require('./routes/posts');

const app = express();
app.use(bodyParser.json());

app.use('/api/posts', posts);

app.listen(80, () => {
  console.log("Server listening on port 80...");
})