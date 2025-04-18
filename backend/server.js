require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Review = require('./models/Review');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Routes

// Register user
app.post('/api/users/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = new User({ email, password, name });
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login user
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ error: 'Invalid login credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get user profile
app.get('/api/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// Create review
app.post('/api/reviews', auth, async (req, res) => {
    try {
        // Check if user already reviewed this album
        const existingReview = await Review.findOne({
            user: req.user._id,
            albumId: req.body.albumId
        });

        if (existingReview) {
            return res.status(400).send({
                error: 'You have already reviewed this album. You can update your existing review instead.'
            });
        }

        const review = new Review({
            ...req.body,
            user: req.user._id
        });
        await review.save();

        // Populate user information before sending response
        await review.populate('user', 'name email');
        res.status(201).send(review);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get reviews for an album
app.get('/api/reviews/album/:albumId', async (req, res) => {
    try {
        const reviews = await Review.find({ albumId: req.params.albumId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        // Calculate average rating
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        
        res.send({
            reviews,
            averageRating: isNaN(averageRating) ? 0 : averageRating,
            totalReviews: reviews.length
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get reviews by a user
app.get('/api/reviews/user/:userId', async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.userId })
            .sort({ createdAt: -1 });
        res.send(reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get reviews for current user
app.get('/api/reviews/me', auth, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.send(reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update review
app.patch('/api/reviews/:id', auth, async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).send({ error: 'Review not found' });
        }

        // Update only allowed fields
        const updates = req.body;
        const allowedUpdates = ['rating', 'comment'];
        const isValidOperation = Object.keys(updates).every(update => 
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }

        Object.assign(review, updates);
        await review.save();
        await review.populate('user', 'name email');
        res.send(review);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete review
app.delete('/api/reviews/:id', auth, async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!review) {
            return res.status(404).send();
        }
        res.send(review);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get user's review for a specific album
app.get('/api/reviews/album/:albumId/user', auth, async (req, res) => {
    try {
        const review = await Review.findOne({
            albumId: req.params.albumId,
            user: req.user._id
        }).populate('user', 'name email');

        if (!review) {
            return res.status(404).send({ error: 'Review not found' });
        }

        res.send(review);
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 