import express from "express"
import { query, body, param, validationResult } from "express-validator"
import validator from "validator"
import * as Blogs from "../models/blogs.js"
import * as BlogsUsers from "../models/blogs-users.js"
import auth from "../middleware/auth.js"
import he from "he"

const blogController = express.Router()

// Get all blogs or search blogs
blogController.get(
  "/blogs",
  query("search_term")
    .optional()
    .isString()
    .withMessage("Search term must be a string")
    .isLength({ max: 100 })
    .withMessage("Search term must be less than 100 characters"),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation error",
        errors: errors.array(),
      })
    }

    const { search_term } = req.query
    try {
      const blogs = search_term
        ? await BlogsUsers.getBySearch(search_term)
        : await BlogsUsers.getAll()
      console.log("The first blogs is: ", blogs[0])

      res.status(200).json({
        status: 200,
        message: "Fetched blogs",
        blogs: blogs,
      })
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to fetch blogs",
        error: error.message,
      })
    }
  }
)

blogController.get(
  "/my-blogs",
  auth(["admin", "member", "trainer"]),
  async (req, res) => {
    console.log("my blogs called")
    console.log("req.headers: ", req.headers)
    try {
      const userId = req.user.userID
      console.log("the user id is: ", userId)
      const blogs = await BlogsUsers.getByUserId(userId)
      console.log("my blogs are: ", blogs)
      res.status(200).json({
        status: 200,
        message: "Fetched user blogs",
        blogs,
      })
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to fetch user blogs",
        error: error.message,
      })
    }
  }
)

// Get a specific blog by ID to edit
blogController.get(
    "/blogs/edit/:id",
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Blog ID must be a positive integer"),
    async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: "Validation error",
          errors: errors.array(),
        })
      }
  
      const { id } = req.params
      console.log("the blog id is: ", id)
      try {
        const blog = await Blogs.getById(id)
        blog.content = decodeContent(blog.content)
        console.log("the blog is: ", blog)
        if (blog) {
          res.status(200).json({
            status: 200,
            message: "Fetched blog",
            blog: blog,
          })
        } else {
          res.status(404).json({
            status: 404,
            message: "Blog not found",
          })
        }
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Failed to fetch blog",
          error: error.message,
        })
      }
    }
  )

// Get a specific blog by ID

const decodeContent = (content) => {
  let decodedContent = he.decode(content)
  while (decodedContent !== he.decode(decodedContent)) {
    decodedContent = he.decode(decodedContent)
  }
  return decodedContent
}

blogController.get(
  "/blogs/:id",
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Blog ID must be a positive integer"),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation error",
        errors: errors.array(),
      })
    }

    const { id } = req.params
    try {
      const blog = await Blogs.getById(id)
      console.log("the blog is: ", blog)
      if (blog) {

        // Decode HTML-encoded content
        blog.content = decodeContent(blog.content)
        console.log("blog.content is: ", blog.content)
        res.status(200).json({
          status: 200,
          message: "Fetched blog",
          blog: blog,
        })
      } else {
        res.status(404).json({
          status: 404,
          message: "Blog not found",
        })
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to fetch blog",
        error: error.message,
      })
    }
  }
)

// Create a new blog
blogController.post(
  "/blogs",
  [
    body("title")
      .isLength({ min: 10 })
      .withMessage("Title must be at least 10 characters long.")
      .trim()
      .escape(),
    body("content")
      .isLength({ min: 100 })
      .withMessage("Content must be at least 100 characters long.")
      .trim()
      .escape(),
  ],
  auth(["admin", "member", "trainer"]),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        errors: errors.array(),
      })
    }
    const { title, content } = req.body
    console.log("the to be posted blog's title is: ", title)
    console.log("the to be posted blog's content is: ", content)
    const { userID } = req.user
    console.log("the logged user to post blog is: ", userID)

    try {
      const postDateTime = new Date()
      const formatDateTime = (dateString) => {
        const date = new Date(dateString) 

        // Extract date and time separately
        const formattedDate = date.toISOString().split("T")[0]
        const formattedTime = date.toTimeString().split(" ")[0] 

        return `${formattedDate} ${formattedTime}` // Combine date and time
      }

      const newBlog = Blogs.newBlog(
        null,
        formatDateTime(postDateTime),
        userID,
        validator.escape(title),
        validator.escape(content),
        0
      )
      console.log("The new blog is: ", newBlog)

      const createdBlog = await Blogs.create(newBlog)
      res.status(201).json({
        status: 201,
        message: "Created blog",
        blog: createdBlog,
      })
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to create blog",
        error: error.message,
      })
    }
  }
)

// Update a blog by ID
blogController.put(
  "/blogs/edit/:id",
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Blog ID must be a positive integer"),
    body("title")
      .isLength({ min: 10 })
      .withMessage("Title must be at least 10 characters long.")
      .trim()
      .escape(),
    body("content")
      .isLength({ min: 100 })
      .withMessage("Content must be at least 100 characters long.")
      .trim()
      .escape(),
  ],
  auth(["admin", "member", "trainer"]),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        errors: errors.array(),
      })
    }
    const { id } = req.params
    const { title, content } = req.body
   
    
    const { userID, role } = req.user
    console.log("The request user who wants to edit blog is: ", req.user)
    console.log("The updated blog is: ", req.body)

    try {
      const blog = await Blogs.getById(id)
      blog.content = decodeContent(blog.content)

      if (!blog) {
        return res.status(400).json({
          status: 404,
          message: "Blog not found",
        })
      }
      console.log("check the database: blog.user_id is: ", blog.user_id)
      // Check if the user is an admin or the owner of the blog
      if (role !== "admin" && Number(blog.user_id) !== Number(userID)) {
        return res.status(403).json({
          status: 403,
          message: "You are not authorized to edit this blog",
        })
      }
      const updatedBlog = await Blogs.update({ id, title, content })
      res.status(200).json({
        status: 200,
        message: "Updated blog",
        blog: updatedBlog,
      })
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to update blog",
        error: error.message,
      })
    }
  }
)

// Delete (archive) a blog by ID
blogController.delete(
  "/blogs/:id",
  auth(["admin", "trainer", "member"]),
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Blog ID must be a positive integer"),
  ],
  async (req, res) => {
    const { id } = req.params
    try {
      await Blogs.deleteById(id) // Archive instead of delete
      res.status(200).json({
        status: 200,
        message: "Archived blog",
      })
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to archive blog",
        error: error.message,
      })
    }
  }
)

// Update blog content directly
blogController.post(
  "blogs/content/:id",
  auth(["admin", "member", "trainer"]),
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Blog ID must be a positive integer"),
    body("title")
      .isLength({ min: 10 })
      .withMessage("Title must be at least 10 characters long.")
      .trim()
      .escape(),
    body("content")
      .isLength({ min: 100 })
      .withMessage("Content must be at least 100 characters long.")
      .trim()
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        errors: errors.array(),
      })
    }
    const { id } = req.params
    const { title, content } = req.body
    const { userID, role } = res.locals

    try {
      const blog = await Blogs.getById(id)
      blog.content = decodeContent(blog.content)

      if (!blog) {
        return res.status(404).json({
          status: 404,
          message: "Blog not found",
        })
      }

      if (role !== "admin" && blog.user_id !== userID) {
        return res.status(403).json({
          status: 403,
          message: "You are not authorized to edit this blog",
        })
      }

      await Blogs.update({ id, title, content })
      res.status(200).json({
        status: 200,
        message: "Blog updated successfully",
      })
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to update blog",
        error: error.message,
      })
    }
  }
)

export default blogController
