require("dotenv").config();
const express = require("express");
const app = express();
// app modules
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
app.use(morgan("dev"));
// app source routes
const postRoutes = require("./routers/post");
// allow server to recive data form body of request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// db connection setup
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db url : " + process.env.DB_URL);
  })
  .catch((err) => {
    console.log("falid to connect to db...");
    console.log("error message : " + err.message);
  });
// make uploads folder static to client side
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
// prepare cros setup
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin ,X-Request-With , Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET , POST ,PATCH ,PUT ,DELETE"
  );
  next();
});
// app routes
app.use("/api/post", postRoutes);
app.use((req, res, next) => {
  res.status(404).json({
    message: "un known url .",
  });
});
module.exports = app;
