const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  postMedia: Array,
});
module.exports = mongoose.model("Post", postSchema);
