const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user (Task 6)
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

// Get the book list available in the shop (Tasks 1 & 10)
public_users.get('/', async function (req, res) {
    try {
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });
        const bookList = await getBooks;
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Get book details based on ISBN (Tasks 2 & 11)
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const getBookByISBN = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject({status: 404, message: "Book not found"});
            }
        });
        const book = await getBookByISBN;
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        return res.status(error.status || 500).json({message: error.message});
    }
});
  
// Get book details based on author (Tasks 3 & 12)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
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
                resolve({booksbyauthor: booksByAuthor});
            } else {
                reject({status: 404, message: "Author not found"});
            }
        });
        const result = await getBooksByAuthor;
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(error.status || 500).json({message: error.message});
    }
});

// Get all books based on title (Tasks 4 & 13)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
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
                resolve({booksbytitle: booksByTitle});
            } else {
                reject({status: 404, message: "Title not found"});
            }
        });
        const result = await getBooksByTitle;
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(error.status || 500).json({message: error.message});
    }
});

// Get book review (Task 5)
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;