# DocShare Docker Deployment Guide

## 🐳 Docker Setup

DocShare được containerized với Docker để dễ dàng deployment và development.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

## 🚀 Quick Start

### Production Deployment

```bash
# Clone repository
git clone <repository-url>
cd DocShare

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Development Setup

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Frontend      │    │   Backend API   │
│   Port: 80/443  │────│   Port: 3000    │────│   Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │   MongoDB       │
                                               │   Port: 27017   │
                                               └─────────────────┘
```

## 🔧 Services

### Frontend (Next.js)
- **Port**: 3000
- **Image**: Custom built from `./DocShare/Dockerfile`
- **Environment**: Production optimized with standalone output

### Backend (Express.js)
- **Port**: 5000
- **Image**: Custom built from `./backend/Dockerfile`
- **Features**: API server with file upload support

### Database (MongoDB)
- **Port**: 27017
- **Image**: `mongo:7.0`
- **Data**: Persistent volume storage

### Reverse Proxy (Nginx)
- **Port**: 80, 443
- **Image**: `nginx:alpine`
- **Features**: Load balancing, SSL termination, rate limiting

## 🌍 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/docshare?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NODE_ENV=production
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Backend**: `http://localhost:5000/api/health`
- **Frontend**: `http://localhost:3000`

### Docker Health Checks
```bash
# Check container health
docker-compose ps

# View health check logs
docker inspect docshare-backend | grep -A 10 Health
```

## 🔒 Security Features

- **Rate Limiting**: API calls limited per IP
- **CORS Protection**: Configured origins
- **Security Headers**: X-Frame-Options, CSP, etc.
- **File Upload Limits**: 50MB max file size
- **JWT Authentication**: Secure token-based auth

## 📈 Scaling

### Horizontal Scaling
```yaml
# docker-compose.scale.yml
services:
  backend:
    deploy:
      replicas: 3
  frontend:
    deploy:
      replicas: 2
```

### Load Balancing
Nginx automatically load balances between multiple backend instances.

## 🛠️ Development

### Hot Reload Development
```bash
# Start with file watching
docker-compose -f docker-compose.dev.yml up

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

### Database Access
```bash
# Connect to MongoDB
docker exec -it docshare-mongodb mongosh -u admin -p password123

# Backup database
docker exec docshare-mongodb mongodump --authenticationDatabase admin -u admin -p password123 --out /backup

# Restore database
docker exec docshare-mongodb mongorestore --authenticationDatabase admin -u admin -p password123 /backup
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   
   # Change ports in docker-compose.yml
   ports:
     - "3001:3000"  # Use different host port
   ```

2. **Memory Issues**
   ```bash
   # Increase Docker memory limit
   # Docker Desktop: Settings > Resources > Memory
   
   # Check container memory usage
   docker stats
   ```

3. **File Permission Issues**
   ```bash
   # Fix upload directory permissions
   docker exec docshare-backend chmod 755 /app/uploads
   ```

### Logs & Debugging
```bash
# View all logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f backend

# Debug container
docker exec -it docshare-backend sh
```

## 🚀 Production Deployment

### SSL Configuration
1. Add SSL certificates to `./nginx/ssl/`
2. Update `nginx.conf` for HTTPS
3. Restart nginx service

### Environment Security
- Change default MongoDB credentials
- Use strong JWT secrets
- Configure firewall rules
- Enable Docker security scanning

### Backup Strategy
```bash
# Automated backup script
#!/bin/bash
docker exec docshare-mongodb mongodump --authenticationDatabase admin -u admin -p password123 --out /backup/$(date +%Y%m%d)
docker cp docshare-mongodb:/backup /host/backup/
```

## 📚 API Documentation

Swagger documentation is available at:
- **Development**: http://localhost:5000/api-docs
- **Production**: https://your-domain.com/api-docs

## 🆘 Support

For issues and questions:
1. Check logs: `docker-compose logs`
2. Verify health checks: `docker-compose ps`
3. Review environment variables
4. Check network connectivity between containers
