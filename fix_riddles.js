const mongoose = require('mongoose');
const Riddle = require('./models/Riddle');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to database');
  
  // Find the riddle with "hsidfhsjfhsjdf" and update it
  const riddleToUpdate = await Riddle.findOne({ question: 'hsidfhsjfhsjdf' });
  
  if (riddleToUpdate) {
    console.log('Found riddle to update:', riddleToUpdate);
    
    // Update it to be a proper riddle
    await Riddle.findByIdAndUpdate(riddleToUpdate._id, {
      question: 'What has keys but no locks, space but no room, and you can enter but not go outside?',
      answer: 'keyboard',
      gameType: 'puzzler',
      difficulty: 'medium',
      category: 'technology'
    });
    
    console.log('Updated riddle successfully');
  }
  
  // Test the query that's used in the game
  const puzzlerRiddles = await Riddle.find({ 
    isActive: true, 
    gameType: { $in: ['puzzler', 'both'] } 
  });
  console.log('Puzzler game riddles after update:', puzzlerRiddles.length);
  
  console.log('\nAll riddles after update:');
  const allRiddles = await Riddle.find({});
  allRiddles.forEach((riddle, index) => {
    console.log(`${index + 1}. ${riddle.question} (gameType: ${riddle.gameType}, isActive: ${riddle.isActive})`);
  });
  
  process.exit(0);
}).catch(err => {
  console.error('Database error:', err);
  process.exit(1);
});
