const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

const app = express();

//db config
const db = require("./config/keys.jsx").MongoURI;

// connect to mongo
mongoose
  .connect(db, { useNewURLParser: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

//expree session middleware
app.use(
  session({
    secret: "secrete",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
//routes
app.use("/", require("./routes/index.jsx"));
app.use("/users", require("./routes/users.jsx"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
