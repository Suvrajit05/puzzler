const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Riddle = require('../models/Riddle');

// Database connection check middleware
const checkDB = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.render('index', { 
            title: 'College Induction Puzzler',
            totalRiddles: 0,
            dbError: true
        });
    }
    next();
};

// Home page
router.get('/', checkDB, async (req, res) => {
    try {
        const totalRiddles = await Riddle.countDocuments({ isActive: true });
        
        res.render('index', { 
            title: 'College Induction Puzzler',
            totalRiddles: totalRiddles
        });
    } catch (error) {
        console.error(error);
        res.render('index', { 
            title: 'College Induction Puzzler',
            totalRiddles: 0
        });
    }
});

// About page
router.get('/about', (req, res) => {
    res.render('about', { title: 'About - Puzzler' });
});

module.exports = router;
