# Deployment Guide - Task Management Dashboard

This guide covers multiple deployment options for your Task Management Dashboard, from development to production.

---

## Table of Contents
1. [Development Deployment](#development-deployment)
2. [Production Build](#production-build)
3. [Deployment Options](#deployment-options)
4. [Backend Deployment](#backend-deployment)
5. [Full-Stack Deployment](#full-stack-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Development Deployment

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git (optional)

### Steps

1. **Install Dependencies**
```bash
cd task-management-dashboard
npm install
```

2. **Start JSON Server (Terminal 1)**
```bash
npm run server
```
This starts the backend API on `http://localhost:5000`

3. **Start React App (Terminal 2)**
```bash
npm start
```
This starts the development server on `http://localhost:3000`

4. **Access Application**
- Open browser: `http://localhost:3000`
- API endpoint: `http://localhost:5000/tasks`

---

## Production Build

### Create Optimized Build

```bash
npm run build
```

**What happens:**
- Creates `build/` folder with optimized files
- Minifies JavaScript and CSS
- Optimizes images and assets
- Generates source maps
- Creates production-ready bundle

**Build Output:**
```
build/
├── static/
│   ├── css/
│   │   └── main.[hash].css
│   ├── js/
│   │   ├── main.[hash].js
│   │   └── [chunk].[hash].js
│   └── media/
├── index.html
├── manifest.json
└── asset-manifest.json
```

### Test Production Build Locally

```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build -p 3000
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

**Easiest deployment for React apps**

#### Method A: Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd task-management-dashboard
vercel
```

4. **Follow prompts:**
- Set up and deploy? Yes
- Which scope? (Select your account)
- Link to existing project? No
- Project name? task-management-dashboard
- Directory? ./
- Override settings? No

5. **Production Deployment**
```bash
vercel --prod
```

#### Method B: Vercel GitHub Integration

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/task-dashboard.git
git push -u origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Configure:
  - Framework Preset: Create React App
  - Build Command: `npm run build`
  - Output Directory: `build`
- Click "Deploy"

3. **Automatic Deployments**
- Every push to `main` triggers deployment
- Preview deployments for pull requests

**Vercel Configuration:**

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

### Option 2: Netlify

**Great for static sites with continuous deployment**

#### Method A: Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Initialize and Deploy**
```bash
cd task-management-dashboard
netlify init
```

4. **Manual Deploy**
```bash
npm run build
netlify deploy --prod --dir=build
```

#### Method B: Netlify Drag & Drop

1. **Build the app**
```bash
npm run build
```

2. **Deploy**
- Go to [netlify.com/drop](https://app.netlify.com/drop)
- Drag and drop the `build` folder
- Get instant deployment URL

#### Method C: Netlify GitHub Integration

1. **Push to GitHub** (same as Vercel)

2. **Connect to Netlify**
- Go to [netlify.com](https://netlify.com)
- Click "New site from Git"
- Choose GitHub and select repository
- Configure:
  - Build command: `npm run build`
  - Publish directory: `build`
- Click "Deploy site"

**Netlify Configuration:**

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Option 3: GitHub Pages

**Free hosting for static sites**

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json**
```json
{
  "homepage": "https://yourusername.github.io/task-management-dashboard",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. **Deploy**
```bash
npm run deploy
```

4. **Configure GitHub**
- Go to repository settings
- Navigate to "Pages"
- Source: `gh-pages` branch
- Save

**Access:** `https://yourusername.github.io/task-management-dashboard`

---

### Option 4: AWS S3 + CloudFront

**Enterprise-grade hosting with CDN**

1. **Build the app**
```bash
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://task-dashboard-app
```

3. **Configure Bucket for Static Hosting**
```bash
aws s3 website s3://task-dashboard-app \
  --index-document index.html \
  --error-document index.html
```

4. **Upload Build Files**
```bash
aws s3 sync build/ s3://task-dashboard-app --delete
```

5. **Set Bucket Policy**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::task-dashboard-app/*"
    }
  ]
}
```

6. **Create CloudFront Distribution** (Optional)
- Improves performance with CDN
- Enables HTTPS
- Global edge locations

---

### Option 5: Docker Deployment

**Containerized deployment for any platform**

#### Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Create nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Create .dockerignore

```
node_modules
build
.git
.gitignore
README.md
npm-debug.log
.env
```

#### Build and Run

```bash
# Build image
docker build -t task-dashboard .

# Run container
docker run -p 80:80 task-dashboard
```

#### Docker Compose (with backend)

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./db.json:/app/db.json
    command: npx json-server --watch db.json --host 0.0.0.0 --port 5000
    ports:
      - "5000:5000"
```

Run with:
```bash
docker-compose up -d
```

---

## Backend Deployment

### Option 1: Replace JSON Server with Real Backend

#### Node.js + Express Backend

Create `server/index.js`:
```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  priority: String,
  createdAt: Date
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Option 2: Deploy JSON Server

#### Heroku Deployment

1. **Create Heroku App**
```bash
heroku create task-dashboard-api
```

2. **Create server.js**
```javascript
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
```

3. **Update package.json**
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

4. **Deploy**
```bash
git add .
git commit -m "Prepare for Heroku"
git push heroku main
```

#### Railway Deployment

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize**
```bash
railway login
railway init
```

3. **Deploy**
```bash
railway up
```

#### Render Deployment

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm run server`
5. Deploy

---

## Full-Stack Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
```bash
vercel --prod
```

**Backend (Railway):**
```bash
railway up
```

**Update API URL:**

Create `.env.production`:
```
REACT_APP_API_URL=https://your-api.railway.app
```

Update `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### Option 2: Single Platform (Render)

**Render supports both frontend and backend**

1. **Deploy Backend**
   - Create Web Service
   - Connect repository
   - Start command: `npm run server`

2. **Deploy Frontend**
   - Create Static Site
   - Build command: `npm run build`
   - Publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL`

---

## Environment Configuration

### Development (.env.development)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Production (.env.production)
```
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

### Usage in Code
```javascript
const API_URL = process.env.REACT_APP_API_URL;
```

**Important:** 
- Variables must start with `REACT_APP_`
- Rebuild required after changing env vars
- Never commit `.env` files with secrets

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --passWithNoTests
    
    - name: Build
      run: npm run build
      env:
        REACT_APP_API_URL: ${{ secrets.API_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## Custom Domain Setup

### Vercel
1. Go to project settings
2. Navigate to "Domains"
3. Add your domain
4. Update DNS records:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

### Netlify
1. Go to site settings
2. Navigate to "Domain management"
3. Add custom domain
4. Update DNS:
   - Type: A, Name: @, Value: 75.2.60.5
   - Type: CNAME, Name: www, Value: your-site.netlify.app

---

## Performance Optimization

### 1. Code Splitting
```javascript
const TaskBoard = React.lazy(() => import('./components/TaskBoard'));

<Suspense fallback={<Loading />}>
  <TaskBoard />
</Suspense>
```

### 2. Service Worker (PWA)
```bash
# Use workbox
npm install workbox-webpack-plugin
```

### 3. CDN for Assets
- Use Cloudflare or AWS CloudFront
- Serve static assets from CDN
- Reduce server load

### 4. Compression
```javascript
// Express backend
const compression = require('compression');
app.use(compression());
```

---

## Monitoring and Analytics

### 1. Error Tracking (Sentry)
```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### 2. Analytics (Google Analytics)
```bash
npm install react-ga4
```

### 3. Performance Monitoring
- Vercel Analytics
- Lighthouse CI
- Web Vitals

---

## Troubleshooting

### Issue: Blank page after deployment
**Solution:**
- Check browser console for errors
- Verify `homepage` in package.json
- Check routing configuration
- Ensure all environment variables are set

### Issue: API calls failing
**Solution:**
- Check CORS configuration
- Verify API URL in environment variables
- Check network tab in DevTools
- Ensure backend is running

### Issue: Build fails
**Solution:**
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install

# Clear React cache
rm -rf build
npm run build
```

### Issue: 404 on page refresh
**Solution:**
- Configure server for SPA routing
- Add redirects in `netlify.toml` or `vercel.json`
- Use HashRouter instead of BrowserRouter (not recommended)

---

## Deployment Checklist

- [ ] Run tests: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] CORS configured on backend
- [ ] Error boundaries implemented
- [ ] Loading states added
- [ ] 404 page created
- [ ] SEO meta tags added
- [ ] Analytics integrated
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] SSL certificate enabled
- [ ] Custom domain configured
- [ ] Monitoring setup
- [ ] Backup strategy in place

---

## Recommended Production Stack

**Best Practice Setup:**

```
Frontend: Vercel
- Automatic deployments
- Edge network
- Preview deployments
- Zero configuration

Backend: Railway / Render
- Easy database integration
- Auto-scaling
- Environment management
- Logs and monitoring

Database: MongoDB Atlas / PostgreSQL
- Managed database
- Automatic backups
- Global distribution

CDN: Cloudflare
- DDoS protection
- SSL
- Caching
- Analytics
```

---

## Quick Deploy Commands

```bash
# Development
npm install && npm run server & npm start

# Build
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=build

# Deploy to GitHub Pages
npm run deploy

# Docker
docker build -t task-dashboard . && docker run -p 80:80 task-dashboard
```

---

## Support and Resources

- [React Deployment Docs](https://create-react-app.dev/docs/deployment/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Docker Documentation](https://docs.docker.com)
- [AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

---

Your Task Management Dashboard is now ready for deployment! Choose the option that best fits your needs and budget. For a quick start, I recommend **Vercel** for its simplicity and excellent developer experience.
