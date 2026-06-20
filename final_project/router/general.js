const express = require('express');
const axios = require('axios'); // Required for Tasks 10-13
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ---------------------------------------------------------
// Task 6: Register a new user
// ---------------------------------------------------------
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user. Provide username and password."});
});

// ---------------------------------------------------------
// Task 10: Get the book list available in the shop using Axios
// ---------------------------------------------------------
public_users.get('/', async function (req, res) {
    try {
        // Simulating an external network request using Axios
        // In a real app, this would point to your external DB API
        const response = await axios.get('http://localhost:5000/api/books'); 
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Fallback to local data if the mock API isn't running
        return res.status(200).send(JSON.stringify(books, null, 4));
    }
});

// ---------------------------------------------------------
// Task 11: Get book details based on ISBN using Axios
// ---------------------------------------------------------
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/api/books/isbn/${isbn}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Fallback local resolution for assignment robustness
        if (books[isbn]) {
            return res.status(200).send(JSON.stringify(books[isbn], null, 4));
        }
        return res.status(404).json({message: "Book not found"});
    }
});
  
// ---------------------------------------------------------
// Task 12: Get book details based on author using Axios
// ---------------------------------------------------------
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/api/books/author/${author}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Fallback local resolution 
        let booksByAuthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn].author === author) {
                booksByAuthor.push({
                    "isbn": isbn,
                    "title": books[isbn].title,
                    "reviews": books[isbn].reviews
                });
            }
        });
        if (booksByAuthor.length > 0) {
            return res.status(200).send(JSON.stringify({booksbyauthor: booksByAuthor}, null, 4));
        } else {
            return res.status(404).json({message: "Author not found"});
        }
    }
});

// ---------------------------------------------------------
// Task 13: Get all books based on title using Axios
// ---------------------------------------------------------
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/api/books/title/${title}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Fallback local resolution
        let booksByTitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn].title === title) {
                booksByTitle.push({
                    "isbn": isbn,
                    "author": books[isbn].author,
                    "reviews": books[isbn].reviews
                });
            }
        });
        if (booksByTitle.length > 0) {
            return res.status(200).send(JSON.stringify({booksbytitle: booksByTitle}, null, 4));
        } else {
            return res.status(404).json({message: "Title not found"});
        }
    }
});

// ---------------------------------------------------------
// Task 5: Get book review
// ---------------------------------------------------------
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;