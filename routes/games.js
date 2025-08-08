const express = require('express');
const router = express.Router();
const Riddle = require('../models/Riddle');
const GameSession = require('../models/GameSession');

// Puzzler Game
router.get('/puzzler', async (req, res) => {
    try {
        // Build query with difficulty filter
        let query = { 
            isActive: true, 
            gameType: { $in: ['puzzler', 'both'] } 
        };
        
        // Add difficulty filter if specified
        const difficulty = req.query.difficulty;
        if (difficulty && difficulty !== 'all') {
            query.difficulty = difficulty;
        }
        
        const riddles = await Riddle.find(query);
        
        if (riddles.length === 0) {
            return res.render('games/no-riddles', { 
                title: 'No Riddles Available',
                gameType: 'puzzler',
                difficulty: difficulty || 'all'
            });
        }
        
        // Get random riddle
        const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
        
        // Initialize or get session
        if (!req.session.puzzlerSession) {
            req.session.puzzlerSession = {
                score: 0,
                questionsAnswered: 0,
                startTime: new Date(),
                difficulty: difficulty || 'all'
            };
        }
        
        // Update session difficulty if changed
        req.session.puzzlerSession.difficulty = difficulty || 'all';
        
        res.render('games/puzzler', { 
            title: 'Puzzler Game',
            riddle: randomRiddle,
            session: req.session.puzzlerSession,
            difficulty: difficulty || 'all'
        });
    } catch (error) {
        console.error(error);
        res.render('error', { 
            title: 'Error',
            message: 'Unable to load puzzler game'
        });
    }
});

// Submit puzzler answer
router.post('/puzzler/answer', async (req, res) => {
    try {
        const { riddleId, answer } = req.body;
        const riddle = await Riddle.findById(riddleId);
        
        if (!riddle) {
            return res.json({ success: false, message: 'Riddle not found' });
        }
        
        const userAnswer = answer.trim().toLowerCase();
        const isCorrect = userAnswer === riddle.answer;
        
        // Update session
        if (!req.session.puzzlerSession) {
            req.session.puzzlerSession = { score: 0, questionsAnswered: 0 };
        }
        
        req.session.puzzlerSession.questionsAnswered++;
        if (isCorrect) {
            req.session.puzzlerSession.score++;
        }
        
        res.json({ 
            success: true, 
            isCorrect: isCorrect,
            correctAnswer: riddle.answer,
            score: req.session.puzzlerSession.score,
            questionsAnswered: req.session.puzzlerSession.questionsAnswered
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error processing answer' });
    }
});

// Wrong Answer Only Game
router.get('/wrong-answer-only', async (req, res) => {
    try {
        // Build query with difficulty filter
        let query = { 
            isActive: true, 
            gameType: { $in: ['wrong-answer-only', 'both'] } 
        };
        
        // Add difficulty filter if specified
        const difficulty = req.query.difficulty;
        if (difficulty && difficulty !== 'all') {
            query.difficulty = difficulty;
        }
        
        const riddles = await Riddle.find(query);
        
        if (riddles.length === 0) {
            return res.render('games/no-riddles', { 
                title: 'No Riddles Available',
                gameType: 'wrong-answer-only',
                difficulty: difficulty || 'all'
            });
        }
        
        // Get random riddle
        const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
        
        // Initialize or get session
        if (!req.session.wrongAnswerSession) {
            req.session.wrongAnswerSession = {
                score: 0,
                questionsAnswered: 0,
                startTime: new Date(),
                difficulty: difficulty || 'all'
            };
        }
        
        // Update session difficulty if changed
        req.session.wrongAnswerSession.difficulty = difficulty || 'all';
        
        res.render('games/wrong-answer-only', { 
            title: 'Wrong Answer Only Game',
            riddle: randomRiddle,
            session: req.session.wrongAnswerSession,
            difficulty: difficulty || 'all'
        });
    } catch (error) {
        console.error(error);
        res.render('error', { 
            title: 'Error',
            message: 'Unable to load wrong answer only game'
        });
    }
});

// Submit wrong answer only answer
router.post('/wrong-answer-only/answer', async (req, res) => {
    try {
        const { riddleId, answer } = req.body;
        const riddle = await Riddle.findById(riddleId);
        
        if (!riddle) {
            return res.json({ success: false, message: 'Riddle not found' });
        }
        
        const userAnswer = answer.trim().toLowerCase();
        
        // For image riddles, any answer is acceptable (no correct answer to check against)
        let isCorrect = false;
        let isWin = false;
        
        if (riddle.imageUrl) {
            // Image riddle - any non-empty answer gets a point
            isWin = userAnswer.length > 0;
            isCorrect = false; // No correct answer for images
        } else {
            // Text riddle - check against actual answer
            isCorrect = userAnswer === riddle.answer;
            isWin = !isCorrect && userAnswer.length > 0;
        }
        
        // Update session
        if (!req.session.wrongAnswerSession) {
            req.session.wrongAnswerSession = { score: 0, questionsAnswered: 0 };
        }
        
        req.session.wrongAnswerSession.questionsAnswered++;
        if (isWin) {
            req.session.wrongAnswerSession.score++;
        }
        
        let message;
        if (riddle.imageUrl) {
            message = isWin ? 'Great guess! You get a point for participating!' : 'Please enter an answer!';
        } else {
            message = isCorrect ? 'Oops! You got it right! No points for correct answers!' : 
                     (isWin ? 'Great! Wrong answer gets you a point!' : 'Invalid answer!');
        }
        
        res.json({ 
            success: true, 
            isWin: isWin,
            isCorrectAnswer: isCorrect,
            correctAnswer: riddle.imageUrl ? null : riddle.answer, // Don't show answer for images
            score: req.session.wrongAnswerSession.score,
            questionsAnswered: req.session.wrongAnswerSession.questionsAnswered,
            message: message
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error processing answer' });
    }
});

// Get new riddle for current game
router.get('/new-riddle/:gameType', async (req, res) => {
    try {
        const gameType = req.params.gameType;
        const difficulty = req.query.difficulty;
        
        let query = { isActive: true };
        
        // Filter based on game type
        if (gameType === 'puzzler') {
            query.gameType = { $in: ['puzzler', 'both'] };
        } else if (gameType === 'wrong-answer-only') {
            query.gameType = { $in: ['wrong-answer-only', 'both'] };
        }
        
        // Add difficulty filter if specified
        if (difficulty && difficulty !== 'all') {
            query.difficulty = difficulty;
        }
        
        const riddles = await Riddle.find(query);
        
        if (riddles.length === 0) {
            return res.json({ success: false, message: 'No riddles available for selected difficulty' });
        }
        
        const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
        res.json({ 
            success: true, 
            riddle: {
                _id: randomRiddle._id,
                question: randomRiddle.question,
                difficulty: randomRiddle.difficulty,
                category: randomRiddle.category,
                hints: randomRiddle.hints,
                imageUrl: randomRiddle.imageUrl
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error loading new riddle' });
    }
});

// Reset game session
router.post('/reset/:gameType', (req, res) => {
    const gameType = req.params.gameType;
    if (gameType === 'puzzler') {
        req.session.puzzlerSession = null;
    } else if (gameType === 'wrong-answer-only') {
        req.session.wrongAnswerSession = null;
    }
    res.json({ success: true });
});

module.exports = router;
