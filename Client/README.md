# Smart Trivia - Client Application

The frontend React application for Smart Trivia, providing an intuitive and responsive user interface for both students and administrators.

## 🎯 Overview

The client application is built with React 19 and provides a modern, responsive interface for quiz taking, user management, and administrative functions. It features role-based routing, real-time quiz interactions, and comprehensive state management.

## 🚀 Features

### Student Features
- **Landing Page**: Attractive homepage with features showcase and testimonials
- **Authentication**: Email-based login with OTP verification
- **Student Dashboard**: Personalized dashboard with quiz statistics
- **Available Quizzes**: Browse and select quizzes by module
- **Quiz Player**: Interactive quiz-taking interface with timer
- **Results Tracking**: View detailed quiz results and performance analytics
- **Progress Monitoring**: Track learning progress over time

### Admin Features
- **Admin Dashboard**: Comprehensive analytics and system overview
- **User Management**: Create, update, and manage user accounts
- **Module Management**: Organize quizzes into categories
- **Quiz Management**: Create, edit, and publish quizzes
- **Question Management**: Add and manage quiz questions
- **Analytics**: View system statistics and user performance

### Technical Features
- **Responsive Design**: Mobile-first approach with modern UI
- **Role-based Routing**: Automatic redirection based on user roles
- **State Management**: Zustand for efficient state handling
- **Real-time Updates**: Live quiz timer and progress tracking
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Toast Notifications**: User-friendly notification system

## 🛠️ Technology Stack

- **React 19.1.1**: Latest React with concurrent features
- **React Router DOM 7.9.4**: Client-side routing
- **Vite 7.1.7**: Fast build tool and development server
- **Zustand 5.0.8**: Lightweight state management
- **Axios 1.12.2**: HTTP client for API communication
- **React Toastify 11.0.5**: Toast notification system
- **CSS3**: Custom styling with modern CSS features

## 📁 Project Structure

```
client/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── admin/              # Admin-specific components
│   │   │   └── ui.jsx          # Admin UI components
│   │   └── AuthGuard.jsx       # Authentication wrapper component
│   ├── pages/                  # Page components
│   │   ├── admin/              # Admin pages
│   │   │   ├── AdminDashboard.jsx    # Admin dashboard
│   │   │   ├── AdminLayout.jsx       # Admin layout wrapper
│   │   │   ├── Modules.jsx           # Module management
│   │   │   ├── Quizzes.jsx           # Quiz management
│   │   │   ├── Questions.jsx         # Question management
│   │   │   └── Users.jsx             # User management
│   │   ├── student/            # Student pages
│   │   │   ├── StudentDashboard.jsx  # Student dashboard
│   │   │   ├── StudentLayout.jsx    # Student layout wrapper
│   │   │   ├── AvailableQuizzes.jsx  # Available quizzes list
│   │   │   └── MyResults.jsx         # Student results
│   │   ├── Landing.jsx         # Landing page
│   │   ├── LoginEmail.jsx      # Email login page
│   │   ├── LoginOtp.jsx         # OTP verification page
│   │   ├── LoginPassword.jsx   # Password login page
│   │   ├── Signup.jsx          # User registration page
│   │   ├── ForgotPassword.jsx  # Password reset page
│   │   ├── QuizPlayer.jsx      # Quiz taking interface
│   │   └── QuizResult.jsx      # Quiz results display
│   ├── styles/                  # Stylesheets
│   │   ├── admin.css           # Admin-specific styles
│   │   ├── landing.css         # Landing page styles
│   │   ├── login.css           # Authentication styles
│   │   └── student.css         # Student interface styles
│   ├── store/                  # State management
│   │   └── auth.js             # Authentication store
│   ├── api/                    # API utilities
│   │   └── http.js             # HTTP client configuration
│   ├── assets/                 # Static assets
│   │   ├── assets.js           # Asset imports
│   │   └── emailTemplates.js   # Email template utilities
│   ├── utils/                  # Utility functions
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Global styles
│   ├── main.jsx                # Application entry point
│   └── index.css               # Base styles
├── public/                     # Public static assets
│   ├── landing-illustration.png
│   └── vite.svg
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build production-ready application
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint for code quality checks

## 🎨 UI/UX Design

### Design Principles
- **Mobile-First**: Responsive design starting from mobile devices
- **Accessibility**: WCAG compliant interface elements
- **User-Centric**: Intuitive navigation and clear information hierarchy
- **Performance**: Optimized loading and smooth interactions

### Color Scheme
- **Primary**: Modern blue tones for trust and professionalism
- **Secondary**: Green accents for success states
- **Warning**: Orange/yellow for alerts and warnings
- **Error**: Red for error states and validation
- **Neutral**: Gray scale for text and backgrounds

### Component Architecture
- **Atomic Design**: Components organized by complexity
- **Reusable**: Shared components across different pages
- **Composable**: Complex components built from simpler ones
- **Maintainable**: Clear separation of concerns

## 🔐 Authentication Flow

### User Registration
1. User enters email on signup page
2. System sends OTP to email
3. User verifies OTP
4. User sets password
5. Account created successfully

### User Login
1. User enters email
2. System sends OTP or user enters password
3. Authentication successful
4. Redirect based on user role (student/admin)

### Role-based Access
- **Students**: Access to dashboard, available quizzes, results
- **Admins**: Access to admin panel, user management, content creation

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Features
- Touch-friendly interface
- Swipe gestures for navigation
- Optimized form inputs
- Responsive images and media

## 🎯 State Management

### Zustand Store Structure
```javascript
// Authentication store
{
  user: {
    id: string,
    email: string,
    role: 'student' | 'admin',
    name: string,
    isAdmin: boolean
  },
  isAuthenticated: boolean,
  login: (credentials) => void,
  logout: () => void,
  updateUser: (userData) => void
}
```

### State Persistence
- User authentication state persisted in localStorage
- Quiz progress maintained during session
- Form data preserved on navigation

## 🔌 API Integration

### HTTP Client Configuration
- Base URL configuration for different environments
- Request/response interceptors for authentication
- Error handling and retry logic
- Loading states and progress indicators

### API Endpoints Used
- **Authentication**: `/auth/*` - Login, signup, OTP verification
- **Public**: `/public/*` - Modules, quizzes, questions
- **Admin**: `/admin/*` - Admin operations
- **Attempts**: `/attempts/*` - Quiz attempts and results

## 🎮 Quiz Interface

### Quiz Player Features
- **Timer**: Real-time countdown with visual indicators
- **Question Navigation**: Previous/next question navigation
- **Answer Selection**: Multiple choice, multi-select, true/false
- **Progress Bar**: Visual progress indicator
- **Auto-save**: Automatic answer saving
- **Submission**: Final submission with confirmation

### Question Types Supported
- **Multiple Choice**: Single correct answer
- **Multi-select**: Multiple correct answers
- **True/False**: Binary choice questions

## 📊 Analytics & Tracking

### Student Analytics
- Quiz completion rates
- Performance trends over time
- Module-wise progress
- Time spent on quizzes

### Admin Analytics
- User engagement metrics
- Quiz popularity statistics
- System usage patterns
- Performance monitoring

## 🚀 Performance Optimization

### Code Splitting
- Route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy components

### Asset Optimization
- Image optimization and lazy loading
- CSS minification and purging
- JavaScript bundling and tree shaking

### Caching Strategy
- Service worker for offline functionality
- Local storage for user preferences
- Memory caching for frequently accessed data

## 🧪 Testing

### Testing Strategy
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for user flows
- E2E tests for critical paths

### Test Commands
```bash
npm run test          # Run unit tests
npm run test:coverage # Run tests with coverage
npm run test:e2e      # Run end-to-end tests
```

## 🚀 Deployment

### Build Process
1. **Production Build**: `npm run build`
2. **Asset Optimization**: Automatic minification and compression
3. **Environment Configuration**: Environment-specific settings
4. **Static Hosting**: Compatible with Vercel, Netlify, AWS S3

### Environment Variables
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Smart Trivia
VITE_APP_VERSION=1.0.0
```

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure server CORS configuration
2. **Authentication Issues**: Check JWT token validity
3. **Build Errors**: Clear node_modules and reinstall
4. **Routing Issues**: Verify React Router configuration

### Debug Mode
```bash
npm run dev -- --debug
```

## 📝 Development Guidelines

### Code Style
- ESLint configuration enforced
- Prettier formatting recommended
- Component naming conventions
- File organization standards

### Git Workflow
- Feature branches for new development
- Pull request reviews required
- Commit message conventions
- Automated testing on PRs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Smart Trivia application. See the main README for license information.

---

**Smart Trivia Client** - Modern, responsive, and user-friendly quiz interface! 🎯