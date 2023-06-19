const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//user model
const User = require("../models/User.jsx");

//login page
router.get("/login", (req, res) => res.render("login"));

//register page
router.get("/register", (req, res) => res.render("register"));

//Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill in all fields " });
  }

  //check if passwords match
  if (password !== password2) {
    errors.push({ msg: "passwords do not match" });
  }

  //check pass lenght
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //user exits
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        //hashing the password
        bcrypt.genSalt(10, (error, salt) =>
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw error;
            //set password to hashed
            newUser.password = hash;
            //save the user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "you are now registered and can log  in "
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

module.exports = router;
