const Book = require("../models/Book.model");

const router = require("express").Router();


// READ: List all books
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


// CREATE: Render form
router.get("/books/create", (req, res) => {
  res.render("books/book-create");
})

// CREATE: Process form
router.post("/books/create", (req, res) => {

  const bookDetails = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    rating: req.body.rating,
  };

  Book.create(bookDetails)
    .then( () => {
      res.redirect("/books");
    })
    .catch( (error) => {
      console.log("Error creating book in the DB", error);
      next(error);
    })
})

// READ: Book details
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
