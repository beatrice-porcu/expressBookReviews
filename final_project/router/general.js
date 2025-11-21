const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  /* FIRST TASK */
  // return res.status(200).json(books);
  /* WITH PROMISES */
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject({ message: "No books available" });
    }
  });

  getBooks
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json(err));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  /** FIRST TASK */
  // let book = books[req.params.isbn];
  // return book ? res.status(200).json(book) : res.status(404).json({ message: "Book not found" });
  /** WITH PROMISES */
  const getBookByISBN = new Promise((resolve, reject) => {
    let book = books[req.params.isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ message: "Book not found" });
    }
  });

  getBookByISBN
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json(err));
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  /* FIRST TASK */
  // let booksByAuthor = Object.values(books).filter(b => b.author === req.params.author)
  // return booksByAuthor.length > 0 ? res.status(200).json(booksByAuthor) : res.status(404).json({ message: `No books by ${req.params.author} in the database` });
  /* WITH PROMISES */
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let booksByAuthor = Object.values(books).filter(b => b.author === req.params.author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ message: `No books by ${req.params.author} in the database` });
    }
  });

  getBooksByAuthor
    .then((booksByAuthor) => res.status(200).json(booksByAuthor))
    .catch((err) => res.status(404).json(err));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  /* FIRST TASK */
  // let booksByTitle = Object.values(books).filter(b => b.title === req.params.title)
  // return booksByTitle.length > 0 ? res.status(200).json(booksByTitle) : res.status(404).json({ message: `No books called ${req.params.title} in the database` });
  /* WITH PROMISES */
  const getBooksByTitle = new Promise((resolve, reject) => {
    let booksByTitle = Object.values(books).filter(b => b.title === req.params.title);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject({ message: `No books called ${req.params.title} in the database` });
    }
  });

  getBooksByTitle
    .then((booksByTitle) => res.status(200).json(booksByTitle))
    .catch((err) => res.status(404).json(err));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  return book ? res.status(200).json(book.reviews) : res.status(404).json({ message: "Book not found" });
});


const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

module.exports.general = public_users;
