const express = require("express");
const Books = require('./BookSchema');
const mongodbConnected = require('./MongoDBConnect');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Books API!');
});

// About Route
app.get('/about', async (req, res) => {
    res.send("MongoDB, Express, React, and Mongoose App. React runs in another application.");
    try {
        const count = await Books.countDocuments().exec();
        console.log("Total documents count before addition:", count);
    } catch (err) {
        console.error(err);
    }
});

// Get All Books
app.get('/allbooks1', async (req, res) => {
    try {
        const books = await Books.find();
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch books');
    }
});

// Get Book by ID
app.get('/getbook/:id', async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);
        if (!book) {
            res.status(404).send('Book not found');
        } else {
            res.json(book);
        }
    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid request');
    }
});

// Add a Book
app.post('/addbooks', async (req, res) => {
    try {
        const newbook = new Books(req.body);
        await newbook.save();
        res.status(200).json({ books: 'Book added successfully' });
    } catch (err) {
        console.error(err);
        res.status(400).send('Adding new book failed');
    }
});

// Update a Book
app.post('/updatebook/:id', async (req, res) => {
    try {
        const updatedBook = await Books.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            res.status(404).send('Book not found');
        } else {
            res.status(200).json({ books: 'Book updated successfully', data: updatedBook });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send('Failed to update book');
    }
});

// Delete a Book
app.post('/deleteBook/:id', async (req, res) => {
    try {
        const deletedBook = await Books.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            res.status(404).send('Book not found');
        } else {
            res.status(200).send('Book deleted successfully');
        }
    } catch (err) {
        console.error(err);
        res.status(400).send('Failed to delete book');
    }
});

// Start the Server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
