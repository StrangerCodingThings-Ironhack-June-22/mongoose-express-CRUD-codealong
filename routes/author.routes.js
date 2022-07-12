const Author = require("../models/Author.model");

const router = require("express").Router();

router.get("/authors", (req, res) => {
  Author.find()
    .then( authorsArr => {
      res.render("authors/authors-list", {authorsArr})
    })
    .catch( (error) => {
      console.log("Error getting authors from DB", error);
      next(error);
    })
});

module.exports = router;
