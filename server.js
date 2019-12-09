const express = require('express');
const path = require('path');

const PORT = 3000;
const app = express();
app.use('/static', express.static('static'));

app.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
