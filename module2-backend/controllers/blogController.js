const Blog = require("../models/Blog");

// GET /api/blogs — public, used by the Home page
async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/blogs/mine — used by the Dashboard page, requires auth
async function getMyBlogs(req, res) {
  try {
    const blogs = await Blog.find({ author: req.userId })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/blogs/:id — a single post
async function getBlogById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Post not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/blogs — used by the Create Blog page, requires auth
async function createBlog(req, res) {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are both required" });
    }
    const blog = await Blog.create({ title, body, author: req.userId });
    const populated = await blog.populate("author", "name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// PUT /api/blogs/:id — requires auth, only the post's own author can edit
async function updateBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Post not found" });
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    const { title, body } = req.body;
    if (title) blog.title = title;
    if (body) blog.body = body;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// DELETE /api/blogs/:id — requires auth, only the post's own author can delete
async function deleteBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Post not found" });
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await blog.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getAllBlogs, getMyBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
