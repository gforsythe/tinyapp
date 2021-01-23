

const searchForUserEmail = function (email, database) { //looks for email and finds a match
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return undefined;
}
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




const checkLogin = function (email, password, database) {//check login if time think about how I might not need it
  for (let key in database) {
    if (database[key].email === email && bcrypt.compareSync(password, database[key].password)) {
      return database[key];
    }
  }
  return null;
}



module.exports = { searchForUserEmail, generateUrlID, generateUserRandomId, checkLogin }