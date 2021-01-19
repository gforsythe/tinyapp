const express = require('express');
const app = express()
const PORT = 8080;
const bodyParser = require('body-parser');
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

function generateRandomString(){
  let result = '';
  let characters= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
   result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));




app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req["body"]["longURL"];
  res.redirect(`/urls/${shortURL}`);
});
app.get('/urls', (req, res) => { //
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});


app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL] }
  res.render('urls_show', templateVars) //we see out specific url
});

app.get('/urls/:shortURL', (req, res) => {
  res.json(urlDatabase); //not sure what this does
});

app.get('/u/:shortURL', (req, res) => {//makes my short URL work when we Click on it it goes to the long url
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL; //store into a variable
  delete urlDatabase[shortURL];//
  res.redirect(`/urls`);
})









// app.get('/',(req, res) => {
  // res.send('Hello');
// });
// app.get('/hello', (req, res) => {
  //   res.send('<html><body>Hello <b>World</b></body></html>\n')
  // })

app.listen(PORT, () => {
  console.log(`Example app listeniing on port ${PORT}!`);
});