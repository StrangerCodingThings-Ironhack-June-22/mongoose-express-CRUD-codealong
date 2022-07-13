const bcryptjs = require('bcryptjs');
const router = require("express").Router();

const mongoose = require('mongoose');
const User = require('../models/User.model');

const saltRounds = 10;


// Display signup form
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// Process signup form
router.post("/signup", (req, res, next) => {

  const { email, password } = req.body;

  // Validation: check if email and password are provided
  if (!email || !password) {
    res.render("auth/signup", { errorMessage: "Please provide email and password" });
    return;
  }


  // Validation: check password strength
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
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
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        // mongodb "unique" validation failed
        const text = "Email needs to be unique. There's already a user with this email address.";
        res.status(400).render('auth/signup', { errorMessage: text });
      } else {
        next(error);
      }
    });
});


// Display login form
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});



router.post("/login", (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {
    res.render("auth/login", { errorMessage: "Please provide email and password" });
    return;
  }

  User.findOne({ email: email })
    .then( userFromDB => {
      if (!userFromDB) {
        //user doesn't exist
        res.render('auth/login', { errorMessage: 'Incorrect credentials (no user with that email address).' });
        return;
      } else if (bcryptjs.compareSync(password, userFromDB.passwordHash)) {
        //login sucessful
        // req.session.currentUser = userFromDB;
        // res.redirect("/user-profile");
        res.render('auth/user-profile', {user: userFromDB});
      } else {
        //login failed (password doesn't match)
        res.render('auth/login', { errorMessage: 'Incorrect credentials.' });
      }
    })
    .catch(error => {
      console.log("Error getting user details from DB", error);
      next(error);
    });
})




// Profile page
router.get('/user-profile', (req, res, next) => {
  res.render('auth/user-profile');
});

module.exports = router;
