require('dotenv').config()

const express = require("express");
const mongoose = require('mongoose');
const path = require("path");

const Blog = require('./modules/blog')
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

var cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const app = express();

const PORT = process.env.PORT || 8000;


// Database connection
URL = "";
mongoose
  .connect(process.env.MONGO_URL)
  .then(e => console.log("MongoDB Connected : " + PORT))

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public/')));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find(); // ✅ Correct way
  console.log(allBlogs);
  res.render("home", {
    user: req.user,
    blogs: allBlogs
  });
});


app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.listen(PORT, () => console.log(`Server started At : ${PORT}`));
