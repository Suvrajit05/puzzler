require('dotenv').config();
const mongoose = require('mongoose');
const Riddle = require('./models/Riddle');

async function checkDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');
        
        const totalCount = await Riddle.countDocuments();
        console.log('Total riddles:', totalCount);
        
        const activeCount = await Riddle.countDocuments({ isActive: true });
        console.log('Active riddles:', activeCount);
        
        const wrongAnswerCount = await Riddle.countDocuments({ 
            isActive: true,
            gameType: { $in: ['wrong-answer-only', 'both'] } 
        });
        console.log('Wrong answer riddles:', wrongAnswerCount);
        
        // Get sample riddle
        const sampleRiddle = await Riddle.findOne({ 
            isActive: true,
            gameType: { $in: ['wrong-answer-only', 'both'] } 
        });
        console.log('Sample riddle:', sampleRiddle ? {
            question: sampleRiddle.question,
            answer: sampleRiddle.answer,
            gameType: sampleRiddle.gameType
        } : 'None found');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkDatabase();
