const express = require('express'); 
const app = express()
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};


function generateRandomString(){//generates random id nnmber 6 digits
  let result = '';
  let characters= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
   result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
//my middleware - they handle my requests and make my life easier to code
//I should install morgan
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());




app.get('/urls/new', (req, res) => { // lets see the newURL
  const username = req.cookies['username'];
  const templateVars = {username};
  res.render('urls_new', templateVars);
});

app.post('/urls', (req, res) => {//create a new tiny url to submit
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req["body"]["longURL"];
  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls', (req, res) => { //is it like home?
  const username = req.cookies['username'];// here the addition of the username with cookies happens
  const templateVars = { urls: urlDatabase, username };//added username
  res.render('urls_index', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const username = req.cookies['username'];
  const templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL], username }
  res.render('urls_show', templateVars) //we see the specific url
});

app.get('/urls/:shortURL', (req, res) => {
  res.json(urlDatabase); //not sure what this does
});

app.post('/urls/:shortURL/delete', (req, res) => {//to delete the url from the table
  const shortURL = req.params.shortURL; //store into a variable
  delete urlDatabase[shortURL];//
  res.redirect(`/urls`);
});
app.get('/u/:shortURL', (req, res) => {//makes my short URL work when we Click on it it goes to the long url
  const longURL = urlDatabase[req.params.shortURL];//change your code dummy what is that wack route
  res.redirect(longURL);
});

app.post('/login', (req,res) => {//we login and the cookie follows the username
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL; //to submit an edit
  const longURL = req.body.newUrl;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);//we redirect to 'home'
});

app.post('/logout',(req,res) => {//allows for user to logout
  res.clearCookie('username')//cookie is clear from the database?
  res.redirect('/urls')//redirect to home
})








app.listen(PORT, () => { // my server is now listening to the client
  console.log(`Example app listeniing on port ${PORT}!`);
});