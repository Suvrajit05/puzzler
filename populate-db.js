// Sample riddles to populate the database
// Run this script once to add initial riddles

const mongoose = require('mongoose');
require('dotenv').config();

const Riddle = require('./models/Riddle');

const sampleRiddles = [
    {
        question: "I have keys but no locks. I have space but no room. You can enter but not go outside. What am I?",
        answer: "keyboard",
        difficulty: "medium",
        category: "technology",
        hints: ["I'm used with computers", "You type on me", "I have letters and numbers"]
    },
    {
        question: "What gets wetter the more it dries?",
        answer: "towel",
        difficulty: "easy",
        category: "general",
        hints: ["Found in bathrooms", "Used after showering", "Made of fabric"]
    },
    {
        question: "I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by almost everyone. What am I?",
        answer: "pencil lead",
        difficulty: "hard",
        category: "general",
        hints: ["Used for writing", "Found in pencils", "Made of graphite"]
    },
    {
        question: "What has many teeth but cannot bite?",
        answer: "comb",
        difficulty: "easy",
        category: "general",
        hints: ["Used for hair", "Found in bathrooms", "Has many thin parts"]
    },
    {
        question: "I'm tall when I'm young, and short when I'm old. What am I?",
        answer: "candle",
        difficulty: "easy",
        category: "general",
        hints: ["I provide light", "I burn", "I'm made of wax"]
    },
    {
        question: "What has hands but cannot clap?",
        answer: "clock",
        difficulty: "medium",
        category: "general",
        hints: ["Shows time", "Found on walls", "Has numbers"]
    },
    {
        question: "In a programming language, what do you call a function that calls itself?",
        answer: "recursion",
        difficulty: "hard",
        category: "programming",
        hints: ["It's a programming concept", "Function calls itself", "Needs a base case"]
    },
    {
        question: "What starts with 'e' and ends with 'e' but only has one letter?",
        answer: "envelope",
        difficulty: "medium",
        category: "wordplay",
        hints: ["Used for mail", "Contains letters", "Made of paper"]
    },
    {
        question: "I am not alive, but I grow. I don't have lungs, but I need air. I don't have a mouth, but water kills me. What am I?",
        answer: "fire",
        difficulty: "medium",
        category: "general",
        hints: ["I'm hot", "I need oxygen", "I produce light"]
    },
    {
        question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
        answer: "letter m",
        difficulty: "hard",
        category: "wordplay",
        hints: ["It's about letters", "Look at the words", "Count occurrences"]
    },
    {
        question: "What building has the most stories?",
        answer: "library",
        difficulty: "easy",
        category: "wordplay",
        hints: ["Contains books", "Public place", "Quiet environment"]
    },
    {
        question: "I have a face but no eyes, hands but no arms. What am I?",
        answer: "clock",
        difficulty: "easy",
        category: "general",
        hints: ["Shows time", "Has numbers", "Ticks"]
    }
];

async function populateDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB');
        
        // Clear existing riddles (optional)
        // await Riddle.deleteMany({});
        // console.log('Cleared existing riddles');
        
        // Check if riddles already exist
        const existingCount = await Riddle.countDocuments();
        if (existingCount > 0) {
            console.log(`Database already has ${existingCount} riddles. Skipping population.`);
            process.exit(0);
        }
        
        // Insert sample riddles
        const result = await Riddle.insertMany(sampleRiddles);
        console.log(`Successfully inserted ${result.length} riddles`);
        
        // Display summary
        const summary = await Riddle.aggregate([
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);
        
        console.log('\nRiddles by difficulty:');
        summary.forEach(item => {
            console.log(`- ${item._id}: ${item.count}`);
        });
        
        console.log('\nDatabase population completed successfully!');
        
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

populateDatabase();
