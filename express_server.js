const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const PORT = 8080;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

//Database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
  // example for my own mind 1k32k3: {  longURL: "https://www.reddit.com", userID: "jadjk" }
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
//functions - express them at a later time
const generateUserRandomId = function () { //give me a user ID
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const generateUrlID = function() {//generates random id nnmber 6 digits
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const searchForUserEmail = function (email, database) { //looks for email and finds a match
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return null;
}

const checkLogin = function (email, password, database) {//check login if time think about how I might not need it
  for (let key in database) {
    if (database[key].email === email && bcrypt.compareSync(password, database[key].password)) {
      return database[key];
    }
  }
  return null;
}


const getURLSForUser = function (userid) {//take user id and find user and show that particular users urls
  let result = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === userid) {
      let temp = { longURL: urlDatabase[key].longURL };
      result[key] = temp;
    }
  }
  return result;
}

//my middleware - they handle my requests and make my life easier to code
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'username',
  keys: ['key1', 'key2']
}));


app.get('/urls/new', (req, res) => { // lets see the newURL
  const userId = req.session["user_id"];
  
  const user = users[userId];
  const templateVars = { user };
  //if you are logged in view the page
  //if not then you are redirected to login
  if (!user) {
    return res.redirect('/login');
  }
  res.render('urls_new', templateVars);
});

app.post('/urls', (req, res) => {//create a new tiny url to submit
  const shortURL = generateUrlID();
  const longURL = req["body"]["longURL"];
  const userID = req.session["user_id"];
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);


});

app.get('/urls', (req, res) => { //is it like home
  const userId = req.session["user_id"];// here the addition of the username with cookies happens
  const urlresult = getURLSForUser(userId);
  const templateVars = { urls: urlresult, user: users[userId] };//added username
  if (!userId) {
    return res.status(401).send('Hey you are not logged in? Would you like to register?');
  } else {
    return res.render('urls_index', templateVars);

  }
  //user not logged in then prompt message sating to login or register
  //if it returns true then we are good to show urls


});

app.get('/urls/:shortURL', (req, res) => {
  const userId = req.session["user_id"];
  const user = users[userId];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user };
  res.render('urls_show', templateVars); //we see the specific url
});

app.get('/database', (req, res) => {
  res.json(urlDatabase); //use for debugging(view the database)
});

app.post('/urls/:shortURL/delete', (req, res) => {//to delete the url from the table
  const shortURL = req.params.shortURL; //store into a variable
  const userId = req.session["user_id"];
  const user = users[userId];
  if (!user) {
    res.status(401).send('Sorry you are not logged in');
    
  } else {
    delete urlDatabase[shortURL];//deletes the url from the database
    res.redirect(`/urls`);
  }
});

app.post('/register', (req, res) => {//once we click register we get sent to urls
  const userID = generateUserRandomId();
  const emailExists = searchForUserEmail(req.body.email, users);
  // const { email, password } = req.body; to inquire later
  let email = req.body.email;
  let password = req.body.password;
  let user = { id: userID, email: email, password: bcrypt.hashSync(password, 10) };
  
  if (!email || !password) { //no email or no passcode? then status shows
    return res.status(400).send('Sorry. You need to put something in the registration form.');
  }
  if (emailExists) { // using the function stored as a variable we can say does email exist?
    return res.status(400).send('Sorry. Our records indicate you already have an account with us.');
  }
  users[userID] = user; //register goes on as normal
  // res.cookie("user_id", userID); //cookie is tagged
  req.session["user_id"] = userID;
  res.redirect('/urls'); // go back to urls
  console.log(user);
});

app.get('/u/:shortURL', (req, res) => {//makes my short URL work when we Click on it it goes to the long url
  const longURL = urlDatabase[req.params.shortURL].longURL;//change your code dummy what is that wack route
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
  const userId = searchForUserEmail(email, users);
  let passwordEmailMatch = checkLogin(email, password, users);
  // let userId = the users verified email come back to this later
  if (passwordEmailMatch) {//email and passcode are a match with database set cookie to user_id with random ID
    req.session['user_id'] = userId["id"];
    res.redirect('/urls');
  } else {
    // if email is legit and password does not match in database respond with error
    return res.status(403).send('Sorry. That e-mail/password is not right.');
  }
});

app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL; //to submit an edit
  const longURL = req.body.newUrl;
  const userId = req.session["user_id"];
  const user = users[userId];
  if (!user) {
    res.status(401).send('Sorry you are not logged in');
    
  } else {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect(`/urls/${shortURL}`);//we redirect to urls

  }
});

app.post('/logout', (req, res) => {//allows for user to logout
  req.session = null
  res.redirect('/urls');//redirect to home
});


app.listen(PORT, () => { // my server is now listening to the client
  console.log(`Example app listeniing on port ${PORT}!`);
});