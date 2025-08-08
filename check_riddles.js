const mongoose = require('mongoose');
const Riddle = require('./models/Riddle');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to database');
  
  const allRiddles = await Riddle.find({});
  console.log('Total riddles:', allRiddles.length);
  
  const activeRiddles = await Riddle.find({ isActive: true });
  console.log('Active riddles:', activeRiddles.length);
  
  const puzzlerRiddles = await Riddle.find({ isActive: true, gameType: { $in: ['puzzler', 'both'] } });
  console.log('Puzzler game riddles:', puzzlerRiddles.length);
  
  const wrongAnswerRiddles = await Riddle.find({ isActive: true, gameType: { $in: ['wrong-answer-only', 'both'] } });
  console.log('Wrong answer game riddles:', wrongAnswerRiddles.length);
  
  console.log('\nAll riddles details:');
  allRiddles.forEach((riddle, index) => {
    console.log(`${index + 1}. ${riddle.question} (gameType: ${riddle.gameType}, isActive: ${riddle.isActive})`);
  });
  
  process.exit(0);
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});
