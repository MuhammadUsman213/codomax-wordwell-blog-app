const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getAllBlogs,
  getMyBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

router.get("/", getAllBlogs);          // public — Home page
router.get("/mine", protect, getMyBlogs); // requires login — Dashboard page
router.get("/:id", getBlogById);
router.post("/", protect, createBlog); // requires login — Create Blog page
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;
