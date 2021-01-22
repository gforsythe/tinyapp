const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//databases
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};
//Database
const users = {
  userRandomID: {
    id: "userRandomId",
    email: "user@example.com",
    password: "purple"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "washer"
  }
};

function generateUserRandomId() { //give me a user ID
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function generateUrlID() {//generates random id nnmber 6 digits
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function searchForUserEmail(email, database) { //looks for email and finds a match
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return null;
}

function checkLogin(email, password, database) {
  for (let key in database) {
    if (database[key].email === email && database[key].password === password) {
      return database[key];
    }
  }
  return null;
}

//my middleware - they handle my requests and make my life easier to code
//I should install morgan
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/urls/new', (req, res) => { // lets see the newURL
  const userId = req.cookies['user_id'];
  const user = users[userId];
  const templateVars = { user };
  res.render('urls_new', templateVars);
});

app.post('/urls', (req, res) => {//create a new tiny url to submit
  let shortURL = generateUrlID();
  urlDatabase[shortURL] = req["body"]["longURL"];
  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls', (req, res) => { //is it like home?
  const userId = req.cookies['user_id'];// here the addition of the username with cookies happens
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user };//added username
  res.render('urls_index', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const userId = req.cookies['user_id'];
  const user = users[userId];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user };
  res.render('urls_show', templateVars); //we see the specific url
});

app.get('/urls/:shortURL', (req, res) => {
  res.json(urlDatabase); //not sure what this does
});

app.post('/urls/:shortURL/delete', (req, res) => {//to delete the url from the table
  const shortURL = req.params.shortURL; //store into a variable
  delete urlDatabase[shortURL];//
  res.redirect(`/urls`);
});

app.post('/register', (req, res) => {//once we click register we get sent to urls
  const userID = generateUserRandomId();
  const emailExists = searchForUserEmail(req.body.email, users);
  // const { email, password } = req.body; to inquire later
  let email = req.body.email;
  let password = req.body.password;
  let user = { id: userID, email: email, password: password };
  if (!email || !password) { //no email or no passcode? then status shows
    return res.status(400).send('Sorry. You need to put something in the registration form.');
  }
  if (emailExists) { // using the function stored as a variable we can say does email exist?
    return res.status(400).send('Sorry. Our records indicate you already have an account with us.');
  }
  users[userID] = user; //register goes on as normal
  res.cookie("user_id", userID); //cookie is tagged
  res.redirect('/urls'); // go back to urls
});

app.get('/u/:shortURL', (req, res) => {//makes my short URL work when we Click on it it goes to the long url
  const longURL = urlDatabase[req.params.shortURL];//change your code dummy what is that wack route
  res.redirect(longURL);
});
//lets see the register page
app.get('/register', (req, res) => {
  res.render('urls_register');
});

app.get('/login', (req, res) => {//this lets client see the login page
  res.render('urls_login');
});

app.post('/login', (req, res) => {//
  const email = req.body.email;
  const password = req.body.password;
  const userId = searchForUserEmail(email,users)
  let passwordEmailMatch = checkLogin(email, password, users);
  // let userId = the users verified email come back to this later
  if (passwordEmailMatch) {//email and passcode are a match with database set cookie to user_id with random ID
    res.cookie('user_id', userId["id"] );
    res.redirect('/urls');
  } else {
  // if email is legit and password does not match in database respond with error
    return res.status(403).send('Sorry. That e-mail/password is not right.');
  }
});

app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL; //to submit an edit
  const longURL = req.body.newUrl;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);//we redirect to urls
});

app.post('/logout', (req, res) => {//allows for user to logout
  res.clearCookie('user_id');//cookie is clear from the database?
  res.redirect('/urls');//redirect to home
});


app.listen(PORT, () => { // my server is now listening to the client
  console.log(`Example app listeniing on port ${PORT}!`);
});