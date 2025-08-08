const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Riddle = require('../models/Riddle');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'riddle-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Admin middleware (simple session-based auth)
const requireAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Admin login page
router.get('/login', (req, res) => {
    res.render('admin/login', { 
        title: 'Admin Login',
        error: req.session.loginError 
    });
    delete req.session.loginError;
});

// Admin login process
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple hardcoded admin credentials (you can enhance this)
    if (username === 'admin' && password === 'puzzle123') {
        req.session.isAdmin = true;
        res.redirect('/admin/dashboard');
    } else {
        req.session.loginError = 'Invalid credentials';
        res.redirect('/admin/login');
    }
});

// Admin dashboard
router.get('/dashboard', requireAdmin, async (req, res) => {
    try {
        const riddles = await Riddle.find().sort({ createdAt: -1 });
        const totalRiddles = riddles.length;
        const activeRiddles = riddles.filter(r => r.isActive).length;
        
        res.render('admin/dashboard', { 
            title: 'Admin Dashboard',
            riddles: riddles,
            totalRiddles: totalRiddles,
            activeRiddles: activeRiddles
        });
    } catch (error) {
        console.error(error);
        res.render('admin/dashboard', { 
            title: 'Admin Dashboard',
            riddles: [],
            totalRiddles: 0,
            activeRiddles: 0,
            error: 'Error loading riddles'
        });
    }
});

// Add new riddle page
router.get('/riddles/new', requireAdmin, (req, res) => {
    const formType = req.query.type || 'riddle'; // Default to riddle type
    
    res.render('admin/riddle-form', { 
        title: formType === 'wrong-answer' ? 'Add Wrong Answer Game' : 'Add New Riddle',
        riddle: null,
        action: 'add',
        formType: formType
    });
});

// Create new riddle
router.post('/riddles', requireAdmin, upload.single('riddleImage'), async (req, res) => {
    try {
        const { question, answer, difficulty, category, formType, hints } = req.body;
        
        const riddleData = {
            difficulty: difficulty || 'medium',
            category: category || 'general',
            gameType: formType === 'wrong-answer' ? 'wrong-answer-only' : 'puzzler',
            hints: hints ? hints.split('\n').filter(h => h.trim()) : []
        };

        // Handle different form types
        if (formType === 'wrong-answer') {
            // Wrong answer game - requires image
            if (!req.file) {
                return res.render('admin/riddle-form', { 
                    title: 'Add Wrong Answer Game',
                    riddle: req.body,
                    action: 'add',
                    formType: 'wrong-answer',
                    error: 'Image is required for wrong answer games'
                });
            }
            riddleData.imageUrl = '/uploads/' + req.file.filename;
            riddleData.question = question || 'Guess what this image shows!';
            // No answer required for image riddles
        } else {
            // Regular riddle - requires question and answer
            if (!question || !answer) {
                return res.render('admin/riddle-form', { 
                    title: 'Add New Riddle',
                    riddle: req.body,
                    action: 'add',
                    formType: 'riddle',
                    error: 'Question and answer are required for riddles'
                });
            }
            riddleData.question = question.trim();
            riddleData.answer = answer.trim().toLowerCase();
        }
        
        const riddle = new Riddle(riddleData);
        await riddle.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        const formType = req.body.formType || 'riddle';
        res.render('admin/riddle-form', { 
            title: formType === 'wrong-answer' ? 'Add Wrong Answer Game' : 'Add New Riddle',
            riddle: req.body,
            action: 'add',
            formType: formType,
            error: 'Error creating riddle: ' + error.message
        });
    }
});

// Edit riddle page
router.get('/riddles/:id/edit', requireAdmin, async (req, res) => {
    try {
        const riddle = await Riddle.findById(req.params.id);
        if (!riddle) {
            return res.redirect('/admin/dashboard');
        }
        
        res.render('admin/riddle-form', { 
            title: 'Edit Riddle',
            riddle: riddle,
            action: 'edit',
            formType: riddle.imageUrl ? 'wrong-answer' : 'riddle'
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
});

// Update riddle
router.put('/riddles/:id', requireAdmin, upload.single('riddleImage'), async (req, res) => {
    try {
        const { question, answer, difficulty, category, formType, hints, isActive } = req.body;
        const existingRiddle = await Riddle.findById(req.params.id);
        
        if (!existingRiddle) {
            return res.redirect('/admin/dashboard');
        }
        
        const updateData = {
            difficulty: difficulty || 'medium',
            category: category || 'general',
            gameType: formType === 'wrong-answer' ? 'wrong-answer-only' : 'puzzler',
            hints: hints ? hints.split('\n').filter(h => h.trim()) : [],
            isActive: isActive === 'on'
        };

        // Handle different form types
        if (formType === 'wrong-answer') {
            // Wrong answer game
            if (req.file) {
                // New image uploaded
                updateData.imageUrl = '/uploads/' + req.file.filename;
            } else {
                // Keep existing image
                updateData.imageUrl = existingRiddle.imageUrl;
            }
            updateData.question = question || 'Guess what this image shows!';
            // Remove answer for image riddles
            updateData.answer = undefined;
        } else {
            // Regular riddle
            if (!question || !answer) {
                return res.render('admin/riddle-form', { 
                    title: 'Edit Riddle',
                    riddle: { ...existingRiddle.toObject(), ...req.body },
                    action: 'edit',
                    formType: 'riddle',
                    error: 'Question and answer are required for riddles'
                });
            }
            updateData.question = question.trim();
            updateData.answer = answer.trim().toLowerCase();
            // Remove image for text riddles
            updateData.imageUrl = undefined;
        }
        
        await Riddle.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        const riddle = await Riddle.findById(req.params.id);
        res.render('admin/riddle-form', { 
            title: 'Edit Riddle',
            riddle: { ...riddle.toObject(), ...req.body },
            action: 'edit',
            formType: req.body.formType || (riddle.imageUrl ? 'wrong-answer' : 'riddle'),
            error: 'Error updating riddle: ' + error.message
        });
    }
});

// Delete riddle
router.delete('/riddles/:id', requireAdmin, async (req, res) => {
    try {
        await Riddle.findByIdAndDelete(req.params.id);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
});

// Admin logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
