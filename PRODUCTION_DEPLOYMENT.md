# Production Deployment Guide

This guide will help you deploy the EEU CAFE application to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)

## Step 1: Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
NODE_ENV=production
PORT=5000

# MongoDB Connection
MONGODB_URI=your-production-mongodb-uri-here

# Admin Key - USE A STRONG RANDOM STRING (at least 32 characters)
ADMIN_KEY=your-strong-random-admin-key-change-this-in-production

# Frontend URL (for CORS)
# For single domain: FRONTEND_URL=https://yourdomain.com
# For multiple domains: FRONTEND_URL=https://domain1.com,https://domain2.com
FRONTEND_URL=https://yourdomain.com
```

### Frontend Environment Variables

Create a `.env.production` file in the `frontend/` directory:

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Step 2: Build the Application

### Build Frontend

```bash
npm run build:frontend
```

This will create an optimized production build in `frontend/dist/`.

### Install Dependencies

```bash
npm run install:all
```

## Step 3: Production Server Setup

### Option A: Using PM2 (Recommended)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Create a PM2 ecosystem file (`ecosystem.config.js` in the root):

```javascript
module.exports = {
  apps: [{
    name: 'eeu-cafe-backend',
    script: './backend/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
```

3. Start the application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option B: Using Node.js directly

```bash
cd backend
NODE_ENV=production npm start
```

## Step 4: Reverse Proxy Setup (Nginx)

Create an Nginx configuration file (`/etc/nginx/sites-available/eeu-cafe`):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Static Files
    location / {
        root /path/to/your/project/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker
    location /sw.js {
        root /path/to/your/project/frontend/dist;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/eeu-cafe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: MongoDB Setup

### Using MongoDB Atlas (Recommended for Production)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Whitelist your server IP address
4. Create a database user
5. Get your connection string and add it to `backend/.env`

### Using Local MongoDB

Ensure MongoDB is running and accessible:
```bash
mongod --dbpath /path/to/data
```

## Step 6: File Uploads Directory

Ensure the uploads directory exists and has proper permissions:

```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

## Step 7: Security Checklist

- [ ] Change `ADMIN_KEY` to a strong random string
- [ ] Use HTTPS (SSL/TLS certificate)
- [ ] Configure CORS properly in production
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Regularly update dependencies
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting (if needed)
- [ ] Set up automated backups for MongoDB

## Step 8: Monitoring

### Health Check Endpoint

Monitor the application health:
```bash
curl https://yourdomain.com/api/health
```

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
```

## Step 9: Updates and Maintenance

### Updating the Application

1. Pull latest changes
2. Install dependencies: `npm run install:all`
3. Build frontend: `npm run build:frontend`
4. Restart PM2: `pm2 restart eeu-cafe-backend`

### Database Backups

Set up regular MongoDB backups:
```bash
# MongoDB Atlas provides automatic backups
# For local MongoDB:
mongodump --out /path/to/backup
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify IP whitelist
   - Check network connectivity

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check Nginx configuration

3. **Static Files Not Loading**
   - Verify build output in `frontend/dist`
   - Check Nginx root path
   - Verify file permissions

4. **Uploads Not Working**
   - Check `backend/uploads` directory permissions
   - Verify Nginx proxy configuration

## Performance Optimization

- Enable gzip compression in Nginx
- Use CDN for static assets (optional)
- Enable MongoDB indexes
- Use PM2 cluster mode for load balancing
- Monitor server resources

## Support

For issues or questions, check the application logs:
- PM2 logs: `pm2 logs eeu-cafe-backend`
- Nginx logs: `/var/log/nginx/error.log`
- Application logs: `./logs/` directory

