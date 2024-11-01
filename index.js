import express from "express";
import bodyParser from "body-parser";
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set view engine to EJS
app.set('view engine', 'ejs'); // This sets EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Sample data
let blogs = [
    { id: 1, title: "Welcome to the void!", content: "This is a safe space." },
];

// Render the index page
app.get("/", (req, res) => {  
    res.render("index", { blogs }); // Render without .ejs extension
});

// Route to create a new post
app.get("/create", (req, res) => {  
    res.render("partials/create.ejs");  // Render without .ejs extension
});

// Submit a new post
app.post("/submit", (req, res) => {
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    const newBlog = {
        id: blogs.length + 1,
        title: req.body.title,
        content: req.body.content,
        date: formattedDate
    };

    blogs.unshift(newBlog);
    res.redirect("/");
});

// Route to edit a post
app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const blogToEdit = blogs.find(blog => blog.id === id);

    if (blogToEdit) {
        res.render("partials/edit.ejs", { blog: blogToEdit });
        } else {
        res.status(404).send("Blog post not found");
    }
});

// Submit edits to a post
app.put("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const blogToEdit = blogs.find(blog => blog.id === id);

    if (blogToEdit) {
        blogToEdit.title = req.body.title;
        blogToEdit.content = req.body.content;
        res.redirect("/");
    } else {
        res.status(404).send("Blog post not found");
    }
});

// Delete a post
app.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    blogs = blogs.filter(blog => blog.id !== id);
    res.redirect("/");
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});