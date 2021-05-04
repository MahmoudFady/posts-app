const express = require("express");
const router = express.Router();
const postController = require("../controller/post");
const upload = require("../middleware/upload");
router.get("/", postController.getPosts);
router.post("/", upload().array("postMedia", 5), postController.addPost);
router.delete("/:postId", postController.deletePost);
module.exports = router;
