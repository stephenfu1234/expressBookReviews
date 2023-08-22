const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios').default;

const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    //Write your code here  
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;

    for (book in books) {
        if (books[book].author == author) {
            return res.send(books[book])
        }
    }

    return res.status(300).json({ message: "Author not found" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;

    for (book in books) {
        if (books[book].title == title) {
            return res.send(books[book])
        }
    }

    return res.status(300).json({ message: "Title not found" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;

const connectToURL = (url)=>{
    const req = axios.get(url);
    req.then(resp => {
        console.log(url)
        console.log(resp.data);
    })
    .catch(err => {
        console.log("Rejected for url "+url)
        console.log(err.toString())
    });
}

// Task 10
connectToURL("http://localhost:5000/");

// Task 11
connectToURL("http://localhost:5000/isbn/2");

// Task 12
connectToURL("http://localhost:5000/author/Dante%20Alighieri");

// Task 13
connectToURL("http://localhost:5000/title/Pride%20and%20Prejudice");