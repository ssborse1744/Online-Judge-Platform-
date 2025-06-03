# CodeArena - Online Judge Platform

A full-stack online coding platform built with React (frontend) and Node.js (backend) that allows users to solve programming problems, submit code, and get real-time feedback.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Problem Management**: Browse, filter, and search coding problems
- **Code Editor**: Built-in code editor with syntax highlighting
- **Multi-language Support**: Support for C++, Java, Python
- **Real-time Execution**: Submit and run code with instant feedback
- **Test Cases**: Manage and run custom test cases
- **User Profiles**: Track progress and submission history
- **Admin Panel**: Manage problems and test cases
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **CodeMirror** - Code editor
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
CodeArena/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── api/        # API configuration
│   │   └── ...
│   ├── public/         # Static assets
│   └── package.json
├── backend/            # Node.js backend API
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── model/          # Database models
│   ├── routes/         # API routes
│   ├── database/       # Database configuration
│   └── package.json
└── package.json        # Root package configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CodeArena
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install separately
npm run frontend:install
npm run backend:install
```

### 3. Environment Setup

#### Frontend (.env)
```bash
# Copy example file
cd frontend
cp .env.example .env

# Update with your configuration
VITE_API_BASE_URL=http://localhost:5050
```

#### Backend (.env)
```bash
# Copy example file
cd backend
cp .env.example .env

# Update with your configuration
MONGODB_URL=mongodb://localhost:27017/OnlineJudgePlatform
SECRET_KEY=your-jwt-secret-key
PORT=5050
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm run frontend:dev  # Frontend on http://localhost:5173
npm run backend:dev   # Backend on http://localhost:5050
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

This project is configured for easy deployment on Vercel with separate deployments for frontend and backend.

#### Quick Deployment
```bash
# Use the deployment script
./deploy.ps1  # Windows PowerShell
# or
./deploy.sh   # Linux/Mac
```

#### Manual Deployment

1. **Deploy Backend**:
   ```bash
   cd backend
   vercel --prod
   ```

2. **Update Frontend Configuration**:
   ```bash
   # Update frontend/.env
   VITE_API_BASE_URL=https://your-backend-url.vercel.app
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📚 API Documentation

### Authentication Endpoints
- `POST /register` - User registration
- `POST /login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Problem Endpoints
- `GET /problems` - Get all problems
- `GET /problems/:id` - Get specific problem
- `POST /problems` - Create new problem (admin)
- `PUT /problems/:id` - Update problem (admin)
- `DELETE /problems/:id` - Delete problem (admin)

### Submission Endpoints
- `POST /submit` - Submit code solution
- `POST /run` - Run code with test cases
- `GET /submissions` - Get user submissions

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or need support:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. For deployment issues, refer to [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🙏 Acknowledgments

- Thanks to all contributors
- Built with modern web technologies
- Inspired by competitive programming platforms

---

**Happy Coding! 🚀**
