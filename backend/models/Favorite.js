const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    albumId: {
        type: String, // Spotify album ID
        required: true
    },
    albumInfo: { 
        title: String,
        imageUrl: String,
        artists: [String]
    }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite; 