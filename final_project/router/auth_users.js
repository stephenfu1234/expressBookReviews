const e = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;  
  let book = books[isbn]
  
  if(book) {
    let reviewToAdd = req.query.review
    let username = req.session.authorization.username
    
    let currentReviews = book.reviews[username]

    if(currentReviews) {
        console.log("updated review")
        book.reviews[username] = reviewToAdd
    } else {
        console.log("new review")
        book.reviews[username] = reviewToAdd
    }

    books[isbn] = book

    return res.status(200).json({message: "Added book review"});
  } else {
    return res.status(300).json({message: "Cannot find ISBN"});
  }  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  
    let book = books[isbn]
    
    if(book) {
      let username = req.session.authorization.username
      
      delete book.reviews[username]
  
      books[isbn] = book
  
      return res.status(200).json({message: "Deleted book review"});
    } else {
      return res.status(300).json({message: "Cannot find ISBN"});
    }  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
