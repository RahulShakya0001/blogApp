const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../modules/blog");
const Comment = require("../modules/comments");

// Multer storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads/")); // Ensure this path exists
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });

// Route to render add blog page
router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user
    });
});

router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        
        if (!blog) {
            return res.status(404).render("404", { message: "Blog not found" });
        }
        const comments = await Comment.find({blogId: req.params.id}).populate('createdBy');
        console.log(comments)
        return res.render("blog", {
            user: req.user,
            blog,
            comments
        });

    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).render("500", { message: "Internal Server Error" });
    }
});

router.post('/comment/:blogId', async (req, res) => {
    try {
        await Comment.create({
            content: req.body.content,  // Fixed "res.body.content" -> "req.body.content"
            blogId: req.params.blogId,  // Fixed "bolgId" -> "blogId"
            createdBy: req.user._id
        });

        return res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Route to handle blog submission
router.post("/", upload.single("coverImage"), async (req, res) => {
    try {
        // Validate if user is logged in
        if (!req.user) {
            return res.status(401).send("Unauthorized: Please log in first.");
        }

        const { title, body } = req.body;

        // Ensure file exists before using req.file.filename
        const coverImageURL = req.file ? `uploads/${req.file.filename}` : null;

        // Create new blog entry
        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id, // Corrected 'createBy' to 'createdBy'
            coverImageURL
        });

        // Redirect to the newly created blog
        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error("Error while creating blog:", error);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
