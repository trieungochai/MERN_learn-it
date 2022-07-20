const express = require("express");
const Post = require("../models/post.model");

const postRouter = express.Router();

// @route POST api/posts
// @desc Create Post
// @access Private
postRouter.post("/", async (req, res) => {
  const { title, description, url, status } = req.body;

  // Validation
  if (!title)
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });

  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: "62d68eef9fcc4535fdcb53ec", // TODO
    });

    await newPost.save();
    return res
      .status(200)
      .json({ success: true, message: "Happy learning", post: newPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = postRouter;
