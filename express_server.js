const express = require('express');
const app = express()
const PORT = 8080;
const urlDatabase = {
  'b2xVn2': 'htttp:www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

app.get('/',(req, res) => {
  res.send('Hello');
});

app.listen(PORT, () => {
  console.log(`Example app listeniing on port ${PORT}!`);
});