const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
exports.getPosts = async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    posts,
  });
};
exports.addPost = async (req, res, next) => {
  const { title, content } = req.body;
  let postMedia = [];
  if (req.files) {
    console.log(req.files);
    const url = req.protocol + "://" + req.get("host") + "/uploads/";
    postMedia = req.files.map((file) => url + file.filename);
  }
  const newPost = await new Post({
    title,
    content,
    postMedia,
  }).save();
  newPost
    ? res.status(200).json({ message: "post added.", newPost })
    : res.status(201).json({ message: "something go wrong.." });
};
exports.deletePost = async (req, res, next) => {
  const postId = req.params["postId"];
  const deletedPost = await Post.findByIdAndDelete(postId);
  const rootPath = path.join(__dirname, "../uploads/");
  console.log(rootPath);
  for (filePath of deletedPost.postMedia) {
    fs.unlinkSync(rootPath + filePath.slice(30));
  }
  if (deletedPost) {
    res.status(200).json({ message: "post deleted" });
  } else {
    res.status(201).json({ message: "faild to delete post" });
  }
};
