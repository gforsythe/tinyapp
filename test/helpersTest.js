const { assert } = require('chai');
const searchForUserEmail = require('../helpers.js');


const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    let user = searchForUserEmail("user@example.com", testUsers)
    let expectedOutput = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    }
    assert(JSON.stringify(user) === JSON.stringify(expectedOutput));
  });
  it('should return undefined if an email that is not in the database', function () {


    let user = searchForUserEmail("user3@example.com", testUsers);
    let expectedOutput = undefined;
    console.log(user);
    console.log(expectedOutput);
    assert(JSON.stringify(user) === JSON.stringify(expectedOutput));
  });
});

