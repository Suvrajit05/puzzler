const mongoose = require('mongoose');

const riddleSchema = new mongoose.Schema({
    question: {
        type: String,
        required: function() {
            return !this.imageUrl; // Question required only if no image
        },
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    answer: {
        type: String,
        required: function() {
            return !this.imageUrl; // Answer not required for image riddles
        },
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    category: {
        type: String,
        default: 'general'
    },
    gameType: {
        type: String,
        enum: ['puzzler', 'wrong-answer-only', 'both'],
        default: 'both'
    },
    hints: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    solvedBy: [{
        type: String // Store user sessions or names
    }]
});

module.exports = mongoose.model('Riddle', riddleSchema);
