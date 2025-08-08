const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    gameType: {
        type: String,
        enum: ['puzzler', 'wrong-answer-only'],
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    questionsAnswered: [{
        riddleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Riddle'
        },
        userAnswer: String,
        isCorrect: Boolean,
        timeSpent: Number // in seconds
    }],
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    isCompleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('GameSession', gameSessionSchema);
