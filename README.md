# Smart Trivia

A comprehensive quiz application built with React and Node.js that allows users to take quizzes, track their progress, and compete with friends. The application features both student and admin interfaces with robust authentication and quiz management capabilities.

## 🚀 Features

### For Students

- **Daily Free Quizzes**: Access to a variety of quizzes across different modules
- **Progress Tracking**: Monitor performance and improvement over time
- **Quiz Taking**: Interactive quiz interface with multiple question types
- **Results & Analytics**: Detailed quiz results with performance metrics
- **User Dashboard**: Personalized dashboard with quiz history and statistics

### For Administrators

- **User Management**: Create, update, and manage user accounts
- **Module Management**: Organize quizzes into different modules/categories
- **Quiz Creation**: Create and publish quizzes with various question types
- **Question Management**: Add multiple choice, multi-select, and true/false questions
- **Analytics Dashboard**: View system statistics and user performance metrics

### Technical Features

- **Secure Authentication**: JWT-based authentication with OTP verification
- **Role-based Access Control**: Separate interfaces for students and admins
- **Real-time Quiz Taking**: Timed quizzes with automatic submission
- **Responsive Design**: Mobile-friendly interface
- **Email Integration**: OTP delivery and notifications via email

## 🏗️ Architecture

The application follows a modern full-stack architecture:

```
smart-trivia/
├── client/          # React frontend application
├── server/          # Node.js/Express backend API
├── package.json     # Root package configuration
└── README.md        # Project documentation
```

### Technology Stack

**Frontend (Client)**

- React 19.1.1
- React Router DOM 7.9.4
- Vite 7.1.7 (Build tool)
- Zustand 5.0.8 (State management)
- Axios 1.12.2 (HTTP client)
- React Toastify 11.0.5 (Notifications)

**Backend (Server)**

- Node.js with Express 4.21.1
- MongoDB with Mongoose 8.19.1
- JWT Authentication
- Nodemailer 7.0.9 (Email service)
- Bcryptjs 3.0.2 (Password hashing)
- Helmet 7.1.0 (Security)
- CORS 2.8.5 (Cross-origin requests)

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Email service configuration (for OTP delivery)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dulanthabrew/WEB-PROJECT-SmartTrivia.git
   cd smart-trivia
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the server directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/smart-trivia
   JWT_SECRET=your-jwt-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   CLIENT_URL=http://localhost:5173
   PORT=5000

   # Email configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the application**

   ```bash
   npm run dev
   ```

   This will start both the client (port 5173) and server (port 5000) concurrently.

### Individual Component Setup

**Start Client Only:**

```bash
cd client
npm install
npm run dev
```

**Start Server Only:**

```bash
cd server
npm install
npm run dev
```

## 📁 Project Structure

### Client Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   └── AuthGuard.jsx   # Authentication wrapper
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── student/        # Student pages
│   │   ├── Landing.jsx     # Landing page
│   │   ├── LoginEmail.jsx  # Login page
│   │   ├── Signup.jsx      # Registration page
│   │   ├── QuizPlayer.jsx  # Quiz taking interface
│   │   └── QuizResult.jsx  # Quiz results page
│   ├── styles/             # CSS stylesheets
│   ├── store/              # State management
│   ├── api/                # API utilities
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json
```

### Server Structure

```
server/
├── models/                 # MongoDB models
│   ├── User.js            # User model
│   ├── Quiz.js            # Quiz model
│   ├── Question.js        # Question model
│   ├── Module.js          # Module model
│   ├── Attempt.js         # Quiz attempt model
│   └── Otp.js             # OTP model
├── routes/                 # API routes
│   ├── auth.js            # Authentication routes
│   ├── admin.js           # Admin routes
│   ├── adminUsers.js      # User management routes
│   ├── attempts.js        # Quiz attempt routes
│   └── public.js          # Public routes
├── middleware/             # Custom middleware
│   ├── auth.js            # Authentication middleware
│   └── admin.js           # Admin authorization
├── utils/                  # Utility functions
│   ├── jwt.js             # JWT utilities
│   └── mailer.js          # Email utilities
└── index.js               # Server entry point
```

## 🔐 Authentication Flow

1. **Registration**: Users register with email and receive OTP
2. **Email Verification**: OTP verification via email
3. **Login**: Email-based login with OTP or password
4. **JWT Tokens**: Access and refresh token system
5. **Role-based Access**: Different interfaces for students and admins

## 📊 Database Schema

### Core Models

- **User**: User accounts with roles (student/admin)
- **Module**: Quiz categories and organization
- **Quiz**: Quiz definitions with metadata
- **Question**: Individual quiz questions with options
- **Attempt**: User quiz attempts and results
- **OTP**: One-time passwords for authentication

## 🛠️ Development

### Available Scripts

**Root Level:**

- `npm run dev`: Start both client and server in development mode

**Client:**

- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

**Server:**

- `npm run dev`: Start server with nodemon

### Code Style

- ESLint configuration for consistent code style
- Prettier formatting (recommended)
- Component-based architecture
- RESTful API design

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set in production:

```env
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
CLIENT_URL=your-production-client-url
PORT=5000
EMAIL_HOST=your-smtp-host
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-email-password
```

### Production Build

```bash
# Build client
cd client
npm run build

# Start server
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation in the `client/` and `server/` directories

## 🔄 Version History

- **v1.0.0**: Initial release with core quiz functionality
- Features: User authentication, quiz creation, quiz taking, results tracking
- Admin panel for content management
- Responsive design and mobile support

---

**Smart Trivia** - Making learning fun and competitive! 🎯
