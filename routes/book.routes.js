const Book = require("../models/Book.model");

const router = require("express").Router();


router.get("/books", (req, res, next) => {
  Book.find()
    .then( (booksFromDB) => {
      const data = {
        booksArr: booksFromDB
      };
      res.render("books/books-list", data);
    })
    .catch( (error) => {
      console.log("Error getting data from DB", error);
      next(error);
    })
});


router.get("/books/:bookId", (req, res) => {
  const bookId = req.params.bookId;

  Book.findById(bookId)
    .then( (bookDetails) => {
      res.render("books/book-details", bookDetails);
    })
    .catch( (error) => {
      console.log("Error getting book details from DB", error);
      next(error);
    })

})

module.exports = router;
