# CodeArena Online Judge - Vercel Deployment Guide

This guide will help you deploy the CodeArena Online Judge platform to Vercel with a React frontend and Node.js backend.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A MongoDB database (MongoDB Atlas recommended for production)
3. Git repository pushed to GitHub/GitLab/Bitbucket

## Project Structure

- **Frontend**: React application with Vite (in `/frontend` directory)
- **Backend**: Node.js/Express API (in `/backend` directory)
- **Database**: MongoDB

## Deployment Steps

### 1. Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account at https://mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/OnlineJudgePlatform`)
5. Whitelist Vercel's IP addresses or use `0.0.0.0/0` for all IPs

### 2. Backend Deployment

1. **Deploy Backend to Vercel**:
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Set Environment Variables** in Vercel dashboard:
   - `MONGODB_URL`: Your MongoDB Atlas connection string
   - `SECRET_KEY`: A secure JWT secret key
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your frontend Vercel URL (will be set after frontend deployment)

3. **Note your backend URL** (e.g., `https://your-backend-app.vercel.app`)

### 3. Frontend Deployment

1. **Update Environment Configuration**:
   ```bash
   # In frontend directory, update .env file
   VITE_API_BASE_URL=https://your-backend-app.vercel.app
   ```

2. **Deploy Frontend to Vercel**:
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Deploy to Vercel
   vercel --prod
   ```

3. **Note your frontend URL** (e.g., `https://your-frontend-app.vercel.app`)

### 4. Update Backend CORS Configuration

1. Go to your backend Vercel dashboard
2. Update the `FRONTEND_URL` environment variable with your frontend URL
3. Redeploy the backend if necessary

## Environment Variables Summary

### Backend (.env)
```bash
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/OnlineJudgePlatform
SECRET_KEY=your-secure-jwt-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=https://your-backend-app.vercel.app
```

## Vercel Configuration Files

### Backend vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Frontend vercel.json
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Alternative: Deploy Using Vercel CLI

### Option 1: Separate Deployments (Recommended)

1. **Deploy Backend**:
   ```bash
   cd backend
   vercel --prod
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

### Option 2: Monorepo Deployment

If you want to deploy both from the root directory:

1. **Create root vercel.json**:
   ```json
   {
     "version": 2,
     "projects": [
       {
         "name": "codearena-backend",
         "source": "backend",
         "builds": [
           {
             "src": "index.js",
             "use": "@vercel/node"
           }
         ]
       },
       {
         "name": "codearena-frontend", 
         "source": "frontend",
         "builds": [
           {
             "src": "package.json",
             "use": "@vercel/static-build"
           }
         ]
       }
     ]
   }
   ```

## Post-Deployment Checklist

- [ ] Backend API endpoints are accessible
- [ ] Frontend can connect to backend APIs
- [ ] User authentication works
- [ ] Database operations work correctly
- [ ] Code submission and execution work
- [ ] All API routes return expected responses

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend
2. **Database Connection**: Verify MongoDB connection string and IP whitelist
3. **Environment Variables**: Check all required env vars are set in Vercel dashboard
4. **API Endpoints**: Ensure frontend is pointing to correct backend URL

### Testing Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Login with the user
4. Browse problems
5. Submit a solution
6. Check if all features work as expected

## Security Considerations

1. Use strong JWT secret keys
2. Keep environment variables secure
3. Use HTTPS for all communications
4. Restrict database access to specific IPs if possible
5. Regularly update dependencies

## Performance Optimization

1. Enable compression in Express.js
2. Use proper caching headers
3. Optimize bundle size (code splitting)
4. Use CDN for static assets
5. Monitor and optimize database queries

## Support

For issues with this deployment:
1. Check Vercel deployment logs
2. Review network requests in browser dev tools
3. Check MongoDB Atlas logs
4. Ensure all environment variables are correctly set
