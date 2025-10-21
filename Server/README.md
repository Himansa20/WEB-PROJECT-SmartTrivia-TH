# Smart Trivia - Server Application

The backend Node.js/Express API for Smart Trivia, providing robust authentication, quiz management, and data persistence with MongoDB.

## 🎯 Overview

The server application is built with Node.js and Express, featuring a RESTful API architecture with JWT authentication, role-based access control, and comprehensive quiz management capabilities. It provides secure endpoints for both student and admin operations.

## 🚀 Features

### Core Features
- **RESTful API**: Well-structured REST endpoints for all operations
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-based Authorization**: Separate access levels for students and admins
- **Email Integration**: OTP delivery and notifications via Nodemailer
- **Rate Limiting**: Protection against abuse and spam
- **Security Middleware**: Helmet for security headers and CORS configuration
- **Database Integration**: MongoDB with Mongoose ODM

### Authentication & Security
- **OTP Verification**: Email-based one-time password system
- **Password Hashing**: Bcryptjs for secure password storage
- **JWT Tokens**: Access and refresh token system
- **Rate Limiting**: Request rate limiting for security
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security

### Quiz Management
- **Module System**: Organize quizzes into categories
- **Quiz Creation**: Full CRUD operations for quizzes
- **Question Management**: Multiple question types support
- **Attempt Tracking**: Complete quiz attempt logging
- **Scoring System**: Automated scoring and result calculation
- **Time Management**: Quiz duration and timeout handling

## 🛠️ Technology Stack

- **Node.js**: JavaScript runtime environment
- **Express 4.21.1**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose 8.19.1**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Bcryptjs 3.0.2**: Password hashing
- **Nodemailer 7.0.9**: Email service
- **Helmet 7.1.0**: Security middleware
- **CORS 2.8.5**: Cross-origin resource sharing
- **Express Rate Limit 8.1.0**: Rate limiting middleware

## 📁 Project Structure

```
server/
├── models/                 # MongoDB data models
│   ├── User.js            # User model with authentication
│   ├── Quiz.js            # Quiz model with metadata
│   ├── Question.js        # Question model with options
│   ├── Module.js          # Module/category model
│   ├── Attempt.js         # Quiz attempt tracking
│   └── Otp.js             # OTP verification model
├── routes/                 # API route handlers
│   ├── auth.js            # Authentication routes
│   ├── admin.js           # Admin management routes
│   ├── adminUsers.js      # User management routes
│   ├── attempts.js        # Quiz attempt routes
│   └── public.js          # Public access routes
├── middleware/             # Custom middleware
│   ├── auth.js            # Authentication middleware
│   └── admin.js           # Admin authorization
├── utils/                  # Utility functions
│   ├── jwt.js             # JWT token utilities
│   └── mailer.js          # Email service utilities
├── index.js               # Server entry point
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Email service (Gmail, SendGrid, etc.)

### Installation

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/smart-trivia
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   CLIENT_URL=http://localhost:5173
   PORT=5000
   
   # Email configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Available Scripts

- `npm run dev`: Start server with nodemon (auto-restart)
- `npm start`: Start production server
- `npm test`: Run test suite (if configured)

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique, indexed),
  passwordHash: String,
  role: String (enum: ['student', 'admin']),
  isSuspended: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz Model
```javascript
{
  moduleId: ObjectId (ref: 'Module'),
  title: String (required),
  description: String,
  durationSeconds: Number (min: 30),
  totalMarks: Number (default: 0),
  isPublished: Boolean (default: false),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Question Model
```javascript
{
  quizId: ObjectId (ref: 'Quiz', indexed),
  type: String (enum: ['mcq', 'multi', 'truefalse']),
  text: String (required),
  options: [{
    key: String (required),
    text: String (required)
  }],
  correctKeys: [String],
  marks: Number (default: 1),
  createdAt: Date,
  updatedAt: Date
}
```

### Attempt Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  quizId: ObjectId (ref: 'Quiz'),
  status: String (enum: ['started', 'submitted', 'expired']),
  startAt: Date,
  endsAt: Date,
  submittedAt: Date,
  durationSeconds: Number,
  score: Number,
  responses: [{
    questionId: ObjectId,
    chosenKeys: [String]
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication System

### JWT Token Structure
```javascript
// Access Token
{
  uid: ObjectId,
  email: String,
  role: String,
  iat: Number,
  exp: Number
}

// Refresh Token
{
  uid: ObjectId,
  tokenVersion: Number,
  iat: Number,
  exp: Number
}
```

### Authentication Flow
1. **Registration**: User provides email → OTP sent → OTP verified → Account created
2. **Login**: Email + OTP/Password → JWT tokens issued
3. **Token Refresh**: Refresh token used to get new access token
4. **Logout**: Tokens invalidated and cleared

### Security Features
- **Password Hashing**: Bcryptjs with salt rounds
- **Token Expiration**: Short-lived access tokens
- **Rate Limiting**: OTP and login attempt limits
- **Input Sanitization**: Request validation and sanitization
- **CORS Configuration**: Controlled cross-origin access

## 🛡️ Middleware

### Authentication Middleware
```javascript
// authRequired - Verifies JWT token
// isAdmin - Checks admin role
// Rate limiting for OTP requests
```

### Security Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin configuration
- **Rate Limiting**: Request throttling
- **Input Validation**: Request sanitization

## 📡 API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/send-otp` - Send OTP to email
- `POST /auth/verify-otp` - Verify OTP code
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password with OTP

### Public Routes (`/public`)
- `GET /public/modules` - Get active modules
- `GET /public/modules/:moduleId/quizzes` - Get module quizzes
- `GET /public/quizzes/:quizId` - Get quiz details
- `GET /public/quizzes/:quizId/questions` - Get quiz questions

### Admin Routes (`/admin`)
- `GET /admin/stats` - System statistics
- `GET /admin/users` - User management
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

### Quiz Attempt Routes (`/attempts`)
- `POST /attempts` - Start quiz attempt
- `GET /attempts/:id` - Get attempt details
- `POST /attempts/:id/submit` - Submit quiz attempt
- `GET /attempts/:id/result` - Get attempt results
- `GET /attempts/user/:userId` - Get user attempts

## 📧 Email Service

### Email Templates
- **OTP Verification**: Clean, professional OTP delivery
- **Password Reset**: Secure password reset links
- **Welcome Email**: User onboarding messages

### Email Configuration
```javascript
// SMTP Configuration
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
}
```

## 🔒 Security Implementation

### Password Security
- **Bcrypt Hashing**: 12 salt rounds minimum
- **Password Requirements**: Length and complexity validation
- **Reset Mechanism**: Secure OTP-based reset

### JWT Security
- **Token Expiration**: 15 minutes access, 7 days refresh
- **Secret Keys**: Environment-based secrets
- **Token Validation**: Comprehensive token verification
- **Logout Security**: Token blacklisting capability

### Rate Limiting
- **OTP Requests**: 5 per 10 minutes
- **Login Attempts**: 10 per 10 minutes
- **API Calls**: Configurable per endpoint

## 📊 Analytics & Monitoring

### System Statistics
- **User Metrics**: Registration, active users, role distribution
- **Quiz Analytics**: Completion rates, average scores
- **Performance**: Response times, error rates
- **Usage Patterns**: Peak times, popular quizzes

### Health Monitoring
- **Database Connection**: MongoDB status monitoring
- **API Health**: Endpoint availability checks
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time tracking

## 🚀 Performance Optimization

### Database Optimization
- **Indexing**: Strategic database indexes
- **Query Optimization**: Efficient MongoDB queries
- **Connection Pooling**: Optimized connection management
- **Aggregation**: Efficient data aggregation

### API Performance
- **Response Caching**: Strategic caching implementation
- **Compression**: Gzip compression for responses
- **Pagination**: Efficient large dataset handling
- **Async Operations**: Non-blocking I/O operations

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Authentication Tests**: Security validation
- **Database Tests**: Data persistence testing

### Test Configuration
```javascript
// Test environment setup
{
  testDatabase: 'smart-trivia-test',
  testPort: 5001,
  mockEmailService: true,
  testTimeout: 10000
}
```

## 🚀 Deployment

### Production Configuration
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-trivia
JWT_SECRET=production-secret-key
JWT_REFRESH_SECRET=production-refresh-secret
CLIENT_URL=https://your-domain.com
PORT=5000
```

### Deployment Options
- **Docker**: Containerized deployment
- **Cloud Platforms**: AWS, Google Cloud, Azure
- **VPS**: Traditional server deployment
- **Serverless**: Vercel, Netlify Functions

### Environment Variables
```env
# Required
MONGO_URI=mongodb://localhost:27017/smart-trivia
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:5173

# Optional
PORT=5000
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🐛 Error Handling

### Error Types
- **Validation Errors**: Input validation failures
- **Authentication Errors**: Token and permission issues
- **Database Errors**: Connection and query failures
- **Business Logic Errors**: Application-specific errors

### Error Response Format
```javascript
{
  ok: false,
  error: "Error message",
  code: "ERROR_CODE",
  details: "Additional error details"
}
```

## 📝 API Documentation

### Request/Response Examples

#### User Registration
```javascript
// POST /auth/register
{
  "email": "user@example.com"
}

// Response
{
  "ok": true,
  "message": "OTP sent to email"
}
```

#### Quiz Attempt
```javascript
// POST /attempts
{
  "quizId": "quiz_id_here"
}

// Response
{
  "ok": true,
  "attempt": {
    "id": "attempt_id",
    "quizId": "quiz_id",
    "endsAt": "2024-01-01T12:00:00Z"
  }
}
```

## 🔧 Development Tools

### Debugging
- **Console Logging**: Comprehensive request/response logging
- **Error Tracking**: Detailed error information
- **Performance Monitoring**: Response time tracking
- **Database Queries**: Query optimization insights

### Development Commands
```bash
npm run dev          # Development with auto-restart
npm run start        # Production start
npm run test         # Run tests
npm run lint         # Code linting
```

## 🤝 Contributing

### Code Standards
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit validation
- **Code Reviews**: Pull request reviews

### Development Workflow
1. Create feature branch
2. Implement changes
3. Add tests
4. Submit pull request
5. Code review
6. Merge to main

## 📄 License

This project is part of the Smart Trivia application. See the main README for license information.

---

**Smart Trivia Server** - Robust, secure, and scalable quiz management API! 🚀
