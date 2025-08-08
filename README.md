# Puzzler23 - College Induction Puzzler Website

A fun and interactive riddle website designed for college induction programs, built with Node.js, Express, EJS, and MongoDB Atlas.

## Features

### 🎮 Two Game Modes
1. **Puzzler Game**: Traditional riddle-solving where you earn points for correct answers
2. **Wrong Answer Only**: Unique twist where you get points for wrong answers (avoid being correct!)

### 🛠 Admin Panel
- Add, edit, and delete riddles
- Manage riddle categories and difficulty levels
- Track riddle status (active/inactive)
- Simple dashboard with statistics

### 📱 Responsive Design
- Mobile-friendly interface
- Bootstrap 5 for modern UI
- Font Awesome icons
- Custom CSS animations

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, Bootstrap 5, JavaScript
- **Database**: MongoDB Atlas
- **Session Management**: Express Session
- **Styling**: Custom CSS, Font Awesome

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd puzzler23
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your configuration:

```env
MONGODB_URI=mongodb+srv://subhrajitsamantasinghar05:<your_password>@cluster0.k06pcbc.mongodb.net/puzzler23
SESSION_SECRET=your_super_secret_session_key_here
PORT=3000
NODE_ENV=development
```

**Important**: Replace `<your_password>` with your actual MongoDB Atlas password.

### 4. Start the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `puzzle123`

⚠️ **Important**: Change these credentials in `routes/admin.js` for production use.

## Project Structure

```
puzzler23/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── models/               # Database models
│   ├── Riddle.js         # Riddle schema
│   └── GameSession.js    # Game session schema
├── routes/               # Route handlers
│   ├── home.js           # Home page routes
│   ├── admin.js          # Admin panel routes
│   └── games.js          # Game routes
├── views/                # EJS templates
│   ├── partials/         # Reusable components
│   ├── admin/            # Admin panel views
│   ├── games/            # Game views
│   ├── index.ejs         # Homepage
│   ├── about.ejs         # About page
│   └── error.ejs         # Error page
└── public/               # Static files
    ├── css/              # Stylesheets
    ├── js/               # JavaScript files
    └── images/           # Images (if any)
```

## Usage Guide

### For Students (Players)

1. **Homepage**: Choose between two game modes
2. **Puzzler Game**: 
   - Answer riddles correctly to earn points
   - Use hints if available
   - Track your accuracy and score
3. **Wrong Answer Only**:
   - Give creative wrong answers to earn points
   - Avoid giving the correct answer
   - Have fun with unconventional thinking

### For Administrators

1. **Login**: Access `/admin/login` with admin credentials
2. **Dashboard**: View all riddles and statistics
3. **Add Riddles**: Create new riddles with:
   - Question text
   - Correct answer
   - Difficulty level (Easy/Medium/Hard)
   - Category
   - Optional hints
4. **Manage Riddles**: Edit or delete existing riddles

## API Endpoints

### Public Routes
- `GET /` - Homepage
- `GET /about` - About page
- `GET /games/puzzler` - Puzzler game
- `GET /games/wrong-answer-only` - Wrong answer only game

### Game API
- `POST /games/puzzler/answer` - Submit puzzler answer
- `POST /games/wrong-answer-only/answer` - Submit wrong answer
- `GET /games/new-riddle/:gameType` - Get new riddle
- `POST /games/reset/:gameType` - Reset game session

### Admin Routes
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Process admin login
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/riddles/new` - Add new riddle form
- `POST /admin/riddles` - Create new riddle
- `GET /admin/riddles/:id/edit` - Edit riddle form
- `PUT /admin/riddles/:id` - Update riddle
- `DELETE /admin/riddles/:id` - Delete riddle

## Database Schema

### Riddle Model
```javascript
{
  question: String,      // The riddle question
  answer: String,        // Correct answer (stored in lowercase)
  difficulty: String,    // 'easy', 'medium', 'hard'
  category: String,      // Category/topic
  hints: [String],       // Array of hints
  isActive: Boolean,     // Whether riddle is active
  createdAt: Date,       // Creation timestamp
  solvedBy: [String]     // Array of solver sessions
}
```

### Game Session Model
```javascript
{
  sessionId: String,           // Session identifier
  gameType: String,            // 'puzzler' or 'wrong-answer-only'
  score: Number,               // Player score
  questionsAnswered: Array,    // Questions and answers
  startTime: Date,             // Game start time
  endTime: Date,               // Game end time
  isCompleted: Boolean         // Game completion status
}
```

## Customization

### Adding New Game Modes
1. Add routes in `routes/games.js`
2. Create corresponding views in `views/games/`
3. Update navigation in `views/partials/header.ejs`

### Styling
- Modify `public/css/style.css` for custom styles
- Update Bootstrap theme in templates

### Admin Features
- Enhance authentication in `routes/admin.js`
- Add new admin views in `views/admin/`

## Deployment

### Using Heroku
1. Create a Heroku app
2. Set environment variables in Heroku config
3. Deploy using Git:
```bash
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku main
```

### Using Railway/Render
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Notes

- Change default admin credentials
- Use strong session secrets
- Validate all user inputs
- Sanitize database queries
- Use HTTPS in production

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
1. Check the documentation
2. Create an issue on GitHub
3. Contact the development team

---

Made with ❤️ for college induction programs!
