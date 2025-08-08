const mongoose = require('mongoose');
const Riddle = require('./models/Riddle');
require('dotenv').config();

const sampleRiddles = [
  {
    question: "I am tall when I am young, and I am short when I am old. What am I?",
    answer: "candle",
    difficulty: "easy",
    category: "general",
    gameType: "puzzler",
    isActive: true
  },
  {
    question: "What has hands but cannot clap?",
    answer: "clock",
    difficulty: "easy", 
    category: "general",
    gameType: "puzzler",
    isActive: true
  },
  {
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answer: "map",
    difficulty: "medium",
    category: "geography",
    gameType: "puzzler", 
    isActive: true
  },
  {
    question: "The more you take, the more you leave behind. What are they?",
    answer: "footsteps",
    difficulty: "hard",
    category: "logic",
    gameType: "puzzler",
    isActive: true
  }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to database');
  
  // Remove the dummy riddle
  await Riddle.deleteOne({ question: 'wdawwadawwad' });
  console.log('Removed dummy riddle');
  
  // Add sample riddles
  for (const riddleData of sampleRiddles) {
    const existingRiddle = await Riddle.findOne({ question: riddleData.question });
    if (!existingRiddle) {
      const riddle = new Riddle(riddleData);
      await riddle.save();
      console.log(`Added riddle: ${riddleData.question}`);
    } else {
      console.log(`Riddle already exists: ${riddleData.question}`);
    }
  }
  
  // Show final count
  const puzzlerRiddles = await Riddle.find({ 
    isActive: true, 
    gameType: { $in: ['puzzler', 'both'] } 
  });
  console.log(`\nTotal puzzler riddles available: ${puzzlerRiddles.length}`);
  
  process.exit(0);
}).catch(err => {
  console.error('Database error:', err);
  process.exit(1);
});
