# CodeArena Online Judge - Vercel Deployment Instructions

This document provides detailed instructions for deploying the CodeArena Online Judge frontend to Vercel.

## Files for Vercel Deployment

The following files have been configured specifically for Vercel deployment:

- `vercel.json` - Main Vercel configuration
- `vercel-prebuild.js` - Script that runs before build to adjust package.json
- `vercel-package.json` - Simplified package.json for Vercel deployment
- `.vercelignore` - Files to exclude from deployment

## Deployment Steps

### Option 1: Deploy via GitHub Integration (Recommended)

1. Push your code to GitHub
2. Log in to your Vercel account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: Leave default (uses vercel.json)
   - Output Directory: `dist`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```
   npm install -g vercel
   ```

2. Navigate to the frontend directory:
   ```
   cd frontend
   ```

3. Deploy to Vercel:
   ```
   vercel --prod
   ```

## Environment Variables

Set the following environment variables in the Vercel project settings:

- `VITE_API_BASE_URL` - URL of your backend API

## Troubleshooting

### Issue: "vite: command not found"

This error occurs when Vercel can't find the Vite command. Our setup includes several fixes for this:

1. The `vercel-prebuild.js` script replaces package.json with a simplified version
2. The `vercel-package.json` file includes Vite in dependencies
3. The build command is set to `vite build` directly

If you continue to have issues:

1. Try forcing a fresh deployment with no cache:
   ```
   vercel --prod --force
   ```

2. Check Vercel build logs for specific errors

3. Make sure your Node.js version is at least 18:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

### Issue: API Connection Problems

If the frontend deploys but can't connect to the backend:

1. Verify the `VITE_API_BASE_URL` is set correctly in Vercel
2. Check that CORS is enabled on your backend
3. Make sure your backend is deployed and accessible

## Successful Deployment

After successful deployment:

1. Your application will be available at: `https://your-app-name.vercel.app`
2. Your static assets will be served from the `dist` directory
3. Vercel will handle routing for your SPA through the rewrites configuration

## Next Steps

1. Set up continuous deployment by connecting your GitHub repository
2. Configure custom domains through the Vercel dashboard
3. Set up monitoring and analytics for your application

For further help, check the Vercel documentation or the main README.md file.
