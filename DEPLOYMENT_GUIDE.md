# Exam Mate - Deployment Guide

## Quick Deployment Options

### 1. Vercel (Recommended - Free & Easy)

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Build the project: `npm run build`
3. Deploy: `vercel --prod`
4. Follow prompts to connect GitHub (optional)

**Or via Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Auto-deploys on every push

### 2. Netlify (Free Alternative)

**Steps:**
1. Build: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag & drop the `dist` folder
4. Or connect GitHub for auto-deploy

### 3. GitHub Pages (Free)

**Steps:**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/exam-mate",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```
3. Run: `npm run deploy`

## Pre-Deployment Checklist

### 1. Update Vite Config
```js
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/', // Change if deploying to subdirectory
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

### 2. Environment Variables
Create `.env.production`:
```
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Exam Mate
VITE_APP_VERSION=1.0.0
```

### 3. Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

## Domain & SSL Setup

### Custom Domain (Optional)
1. **Vercel**: Add domain in dashboard settings
2. **Netlify**: Domain settings → Add custom domain
3. **GitHub Pages**: Settings → Pages → Custom domain

### SSL Certificate
- Vercel/Netlify: Automatic HTTPS
- Custom hosting: Use Let's Encrypt or Cloudflare

## Performance Optimizations

### 1. Code Splitting (Already Implemented)
```js
// Lazy loading routes
const AdminDashboard = lazy(() => import('./pages/Dashboard/AdminDashboard'))
```

### 2. Bundle Analysis
```bash
npm install --save-dev rollup-plugin-visualizer
npm run build -- --analyze
```

### 3. PWA Setup (Optional)
```bash
npm install vite-plugin-pwa
```

## Deployment Scripts

### package.json additions:
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod --dir=dist",
    "deploy:gh-pages": "gh-pages -d dist"
  }
}
```

## Quick Deploy Commands

### Vercel (Fastest)
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Manual Upload
```bash
npm run build
# Upload 'dist' folder to any web hosting service
```

## Post-Deployment

### 1. Test Functionality
- [ ] Login with all user roles
- [ ] Create/manage exams
- [ ] Generate hall tickets
- [ ] Seat allocation system
- [ ] File uploads work
- [ ] Responsive design on mobile

### 2. Performance Check
- [ ] Page load speed < 3 seconds
- [ ] Mobile responsiveness
- [ ] HTTPS enabled
- [ ] SEO meta tags

### 3. Monitoring Setup
- Google Analytics (optional)
- Error tracking (Sentry)
- Uptime monitoring

## Troubleshooting

### Common Issues:

**1. Build Errors:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**2. Routing Issues (SPA):**
Add `_redirects` file for Netlify:
```
/*    /index.html   200
```

Add `vercel.json` for Vercel:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**3. Environment Variables:**
- Prefix with `VITE_` for client-side access
- Set in hosting platform dashboard

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use platform-specific env var settings
- Rotate API keys regularly

### 2. HTTPS Only
- Force HTTPS redirects
- Set secure headers
- Use CSP headers

### 3. Data Protection
- Client-side data is not secure
- Consider backend API for sensitive data
- Implement proper authentication

## Cost Estimates

### Free Tiers:
- **Vercel**: 100GB bandwidth/month
- **Netlify**: 100GB bandwidth/month  
- **GitHub Pages**: 1GB storage, 100GB bandwidth/month

### Paid Options:
- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month
- **AWS S3 + CloudFront**: ~$1-5/month

## Recommended: Vercel Deployment

**Why Vercel:**
✅ Zero configuration  
✅ Automatic HTTPS  
✅ Global CDN  
✅ GitHub integration  
✅ Preview deployments  
✅ Excellent performance  

**Deploy Now:**
```bash
npm run build
npx vercel --prod
```

Your Exam Mate website will be live in minutes!