# Production Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Environment Setup
- [ ] Create production `.env` file in `backend/` directory
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Generate strong `ADMIN_KEY` (32+ characters, random)
- [ ] Set `FRONTEND_URL` for CORS
- [ ] Create `.env.production` in `frontend/` directory
- [ ] Set `VITE_API_URL` to production API URL

### Security
- [ ] Change default admin key
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Review and update dependencies
- [ ] Remove console.log statements (handled by build)
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Secure file upload directory permissions

### Build & Test
- [ ] Run `npm run install:all`
- [ ] Run `npm run build:frontend`
- [ ] Test production build locally
- [ ] Verify all API endpoints work
- [ ] Test file uploads
- [ ] Test admin panel functionality
- [ ] Verify notifications work

### Database
- [ ] Set up MongoDB (Atlas or local)
- [ ] Create database user with proper permissions
- [ ] Whitelist server IP in MongoDB Atlas
- [ ] Test database connection
- [ ] Set up automated backups

### Server Configuration
- [ ] Install PM2: `npm install -g pm2`
- [ ] Configure PM2 ecosystem file
- [ ] Set up Nginx reverse proxy
- [ ] Configure SSL certificate
- [ ] Set up log rotation
- [ ] Configure process monitoring

## Deployment Steps

1. [ ] Upload code to production server
2. [ ] Install dependencies: `npm run install:all`
3. [ ] Build frontend: `npm run build:frontend`
4. [ ] Configure environment variables
5. [ ] Start application with PM2: `pm2 start ecosystem.config.js`
6. [ ] Save PM2 configuration: `pm2 save`
7. [ ] Set up PM2 startup: `pm2 startup`
8. [ ] Configure Nginx
9. [ ] Test all functionality
10. [ ] Monitor logs and errors

## Post-Deployment

### Monitoring
- [ ] Set up health check monitoring
- [ ] Configure error alerting
- [ ] Monitor server resources (CPU, memory, disk)
- [ ] Set up uptime monitoring
- [ ] Review application logs

### Maintenance
- [ ] Schedule regular backups
- [ ] Plan update schedule
- [ ] Document deployment process
- [ ] Set up rollback procedure

## Quick Commands

### Build for Production
```bash
npm run build:all
```

### Start Production Server
```bash
pm2 start ecosystem.config.js
```

### View Logs
```bash
pm2 logs eeu-cafe-backend
```

### Restart Application
```bash
pm2 restart eeu-cafe-backend
```

### Check Health
```bash
curl https://yourdomain.com/api/health
```

## Troubleshooting

### Application won't start
- Check environment variables
- Verify MongoDB connection
- Check port availability
- Review PM2 logs

### Static files not loading
- Verify build output exists
- Check Nginx configuration
- Verify file permissions

### API errors
- Check CORS configuration
- Verify MongoDB connection
- Review backend logs
- Check admin key configuration

