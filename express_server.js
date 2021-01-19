const express = require('express');
const app = express()
const PORT = 8080;
const bodyParser = require('body-parser');
const urlDatabase = {
  'b2xVn2': 'htttp:www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

function generateRandomString(){
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
   result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/',(req, res) => {
  res.send('Hello');
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  res.send('Ok');
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});


app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL] }
  res.render('urls_show', templateVars)
});

app.get('/urls', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n')
})

app.listen(PORT, () => {
  console.log(`Example app listeniing on port ${PORT}!`);
});