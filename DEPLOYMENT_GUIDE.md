# Deployment Guide: Deploy to Vercel via GitHub

## Prerequisites
- GitHub account
- Vercel account
- Your project pushed to GitHub

## Step 1: Deploy Backend

1. **Go to [vercel.com](https://vercel.com) and sign in**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - Framework Preset: `Node.js`
   - Root Directory: `Backend`
   - Build Command: `npm install`
   - Output Directory: Leave empty
   - Install Command: `npm install`
5. **Add Environment Variables:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`
6. **Click "Deploy"**
7. **Copy the deployment URL** (e.g., `https://your-backend.vercel.app`)

## Step 2: Update Frontend Configuration

1. **Update the config file** in `Frontend/src/config/config.js`
2. **Replace** `'https://your-backend-url.vercel.app'` with your actual backend URL
3. **Commit and push** the changes to GitHub

## Step 3: Deploy Frontend

1. **Go back to Vercel dashboard**
2. **Click "New Project"**
3. **Import your GitHub repository again**
4. **Configure the project:**
   - Framework Preset: `Create React App`
   - Root Directory: `Frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
5. **Add Environment Variables:**
   - `REACT_APP_API_URL`: Your backend URL from Step 1
   - `NODE_ENV`: `production`
6. **Click "Deploy"**

## Step 4: Configure Custom Domain (Optional)

1. **Go to your project settings in Vercel**
2. **Navigate to "Domains"**
3. **Add your custom domain**
4. **Follow the DNS configuration instructions**

## Step 5: Set Up Automatic Deployments

1. **Every time you push to your main branch, Vercel will automatically redeploy**
2. **You can also set up preview deployments for pull requests**

## Important Notes

- **Backend**: Make sure your MongoDB database is accessible from Vercel's servers
- **Environment Variables**: Never commit sensitive information like API keys
- **CORS**: Your backend should allow requests from your frontend domain
- **Build Optimization**: Vercel will automatically optimize your builds

## Troubleshooting

- **Build Failures**: Check the build logs in Vercel dashboard
- **Environment Variables**: Ensure all required variables are set
- **Database Connection**: Verify MongoDB connection string and network access
- **API Calls**: Check browser console for CORS or network errors

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
