const bcryptjs = require('bcryptjs');
const router = require("express").Router();
const User = require('../models/User.model');

const saltRounds = 10;


// Display signup form
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// Process signup form
router.post("/signup", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    res.render("auth/signup", { errorMessage: "Please provide email and password" });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => {
      return bcryptjs.hash(password, salt);
    })
    .then(hash => {
      const userDetails = {
        email,
        passwordHash: hash
      }

      return User.create(userDetails)
    })
    .then(userFromDB => {
      res.redirect("/user-profile")
    })
    .catch(error => {
      console.log("error creating account", error);
      next(error);
    });
});


// Profile page
router.get('/user-profile', (req, res, next) => {
  res.render('auth/user-profile');
});

module.exports = router;
