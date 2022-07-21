const express = require("express");
const verifyToken = require("../middleware/auth.middleware");
const Post = require("../models/post.model");

const postRouter = express.Router();

// @route POST api/posts
// @desc Create Post
// @access Private
postRouter.post("/", verifyToken, async (req, res) => {
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
      userId: req.userId,
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

// @route GET api/posts
// @des Get posts
// @access Private
postRouter.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId }).populate(
      "userId",
      "username"
    );
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// @route PUT api/posts
// @des Update post
// @access Private
postRouter.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  // Validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });

  try {
    let updatedPost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "TO LEARN",
    };

    const updatePostCondition = { _id: req.params.id, userId: req.userId };

    updatedPost = await Post.findOneAndUpdate(
      updatePostCondition,
      updatedPost,
      {
        new: true,
      }
    );

    // User not authorized to update post, or post not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "User not authorized to update post, or post not found",
      });
    return res.status(200).json({
      success: true,
      message: "Successfully updated",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// @route DELETE api/posts
// @des Delete post
// @access Private
postRouter.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletePostCondition = { _id: req.params.id, userId: res.userId };
    const deletePost = await Post.findByIdAndDelete(deletePostCondition);

    // User not authorized to update post, or post not found
    if (!deletePost)
      return res.status(401).json({
        success: false,
        message: "User not authorized to update post, or post not found",
      });
    return res
      .status(200)
      .json({
        success: true,
        message: "Successfully deleted",
        post: deletePost,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = postRouter;
