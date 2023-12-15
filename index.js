const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");
require("dotenv").config();

const {
  checkforAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
// "mongodb+srv://hardiksharma756:yXVWkMao2HXeGapZ@cluster0.lvjfyka.mongodb.net/blogging_app"
mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("connection to MongoDB successful"))
  .catch((err) => console.log("error connecting to MongoDB"));

app.use(express.urlencoded({ extented: false }));
app.use(cookieParser());
app.use(checkforAuthenticationCookie("Token"));
app.use(express.static(path.resolve("./public")));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.listen(PORT, () => console.log(`server listening to port ${PORT}`));
