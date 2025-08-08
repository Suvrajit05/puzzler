const express = require('express');
const router = express.Router();
const Riddle = require('../models/Riddle');

// Home page
router.get('/', async (req, res) => {
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
