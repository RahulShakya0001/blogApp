const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
      default: "/images/default-blog-cover.jpg", // Optional default image
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true, // Ensures a blog has an author
    },
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);
module.exports = Blog;
