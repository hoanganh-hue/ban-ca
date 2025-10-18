# 🎮 Underwater Fishing Game - Docker Deployment Guide

**Complete Production Deployment Package**

---

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [System Requirements](#system-requirements)
- [Configuration](#configuration)
- [Deployment Process](#deployment-process)
- [Service Management](#service-management)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Scaling & Performance](#scaling--performance)

---

## 🚀 Quick Start

### 1-Command Deployment
```bash
# Clone and deploy in one go
cd deployment && chmod +x deploy.sh && ./deploy.sh
```

**That's it!** Your game will be running at `http://localhost` within 5 minutes.

---

## 🔧 System Requirements

### Minimum Requirements
- **OS**: Linux (Ubuntu 20.04+ recommended), macOS, Windows with WSL2
- **RAM**: 4GB available
- **Storage**: 10GB free space
- **CPU**: 2 cores
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+

### Recommended for Production
- **RAM**: 8GB+ available
- **Storage**: 50GB+ SSD
- **CPU**: 4+ cores
- **Network**: 100Mbps+ bandwidth

### Cloud Platform Support
- ✅ **AWS EC2** (t3.large or larger)
- ✅ **Google Cloud Compute** (e2-standard-2 or larger)
- ✅ **Azure Virtual Machines** (B2s or larger)
- ✅ **DigitalOcean Droplets** (4GB+ memory)
- ✅ **Linode** (4GB+ memory)
- ✅ **Vultr** (4GB+ memory)

---

## ⚙️ Configuration

### Environment Setup
1. **Copy environment template**:
   ```bash
   cp deployment/.env.production.example deployment/.env.production
   ```

2. **Edit configuration**:
   ```bash
   nano deployment/.env.production
   ```

### 🔐 Critical Security Settings
**MUST CHANGE BEFORE PRODUCTION:**
```bash
# Database password (use strong password)
POSTGRES_PASSWORD=your_super_secure_password_here

# JWT secret (minimum 32 characters)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Domain configuration
CORS_ORIGIN=https://yourdomain.com
REACT_APP_SERVER_URL=wss://yourdomain.com
REACT_APP_API_URL=https://yourdomain.com/api
```

### 🌐 Domain & SSL Configuration
1. **Point your domain** to your server's IP address
2. **Enable SSL** (optional but recommended):
   ```bash
   # Place SSL certificates in deployment/ssl/
   deployment/ssl/cert.pem
   deployment/ssl/key.pem
   
   # Uncomment HTTPS server block in nginx/nginx.prod.conf
   ```

---

## 🚀 Deployment Process

### Automated Deployment (Recommended)
```bash
cd deployment
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment
```bash
# 1. Build images
docker-compose -f deployment/docker-compose.production.yml build

# 2. Start services
docker-compose -f deployment/docker-compose.production.yml --env-file deployment/.env.production up -d

# 3. Run database migrations
docker-compose -f deployment/docker-compose.production.yml exec server npm run db:migrate
```

### Verify Deployment
```bash
# Check service status
./scripts/status.sh

# View logs
./scripts/logs.sh

# Test game access
curl http://localhost/health
```

---

## 🛠️ Service Management

### Daily Operations
```bash
# Check status
./scripts/status.sh

# View logs
./scripts/logs.sh [service] [-f]

# Restart services
./scripts/restart.sh [service]

# Stop services
./scripts/stop.sh
```

### Available Services
- **nginx** - Web server & reverse proxy
- **server** - Game server (Node.js)
- **client** - Client application (React)
- **postgres** - Database
- **redis** - Cache & session store

### Service Commands Examples
```bash
# Follow server logs in real-time
./scripts/logs.sh server -f

# Restart only the game server
./scripts/restart.sh server

# Show last 50 nginx log lines
./scripts/logs.sh nginx -n 50

# Show all logs from last 2 hours
./scripts/logs.sh all --since 2h
```

---

## 📊 Monitoring & Maintenance

### Health Monitoring
```bash
# Automated health checks
curl http://localhost/health

# Service status dashboard
./scripts/status.sh

# Resource monitoring
docker stats
```

### Database Backup
```bash
# Manual backup
./scripts/backup.sh

# Automated daily backups (setup cron)
echo "0 2 * * * /path/to/deployment/scripts/backup.sh" | crontab -
```

### Log Management
```bash
# View aggregated logs
./scripts/logs.sh all

# Monitor real-time logs
./scripts/logs.sh all -f

# Search logs
docker-compose logs | grep "ERROR"
```

### Performance Monitoring
```bash
# Container resource usage
docker stats --no-stream

# System resource usage
top
htop  # if available

# Disk usage
df -h
docker system df
```

---

## 🔐 Security Considerations

### Production Security Checklist
- [ ] Changed all default passwords
- [ ] Updated JWT secret key
- [ ] Configured proper CORS origins
- [ ] Enabled SSL/HTTPS
- [ ] Configured firewall rules
- [ ] Set up log monitoring
- [ ] Implemented rate limiting
- [ ] Regular security updates

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### Database Security
- Database is not exposed to external network
- Strong password authentication
- Regular backup encryption
- Connection limits configured

---

## 🚨 Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check logs for errors
./scripts/logs.sh [service]

# Check service status
./scripts/status.sh

# Restart problematic service
./scripts/restart.sh [service]
```

#### Database Connection Issues
```bash
# Check database status
./scripts/status.sh

# Check database logs
./scripts/logs.sh postgres

# Test database connection
docker-compose exec server npm run db:migrate
```

#### High Memory Usage
```bash
# Check container resource usage
docker stats

# Clean up unused Docker resources
docker system prune -f

# Restart services to clear memory
./scripts/restart.sh all
```

#### SSL/HTTPS Issues
1. Verify certificate files are in `deployment/ssl/`
2. Check nginx configuration in `nginx/nginx.prod.conf`
3. Ensure domain is properly pointed to your server

### Getting Help
```bash
# View comprehensive logs
./scripts/logs.sh all --since 24h > debug.log

# Check system resources
./scripts/status.sh > status.log

# Docker system information
docker info > docker-info.log
```

---

## 📈 Scaling & Performance

### Horizontal Scaling
The deployment supports multiple game server instances:

```yaml
# In docker-compose.production.yml
server:
  deploy:
    replicas: 3  # Run 3 server instances
```

### Performance Optimization

#### Database Optimization
```bash
# Monitor database performance
docker-compose exec postgres psql -U gameuser -d underwater_game -c "SELECT * FROM pg_stat_activity;"

# Database maintenance
docker-compose exec postgres psql -U gameuser -d underwater_game -c "VACUUM ANALYZE;"
```

#### Redis Optimization
```bash
# Monitor Redis performance
docker-compose exec redis redis-cli INFO memory
docker-compose exec redis redis-cli INFO stats
```

#### Resource Limits
Adjust resource limits in `docker-compose.production.yml`:
```yaml
server:
  deploy:
    resources:
      limits:
        memory: 2G      # Increase for high load
        cpus: '2.0'     # Increase for high load
```

### Load Testing
```bash
# Install load testing tool
npm install -g artillery

# Create load test configuration
cat > loadtest.yml << EOF
config:
  target: 'http://localhost'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Game load test"
    requests:
      - get:
          url: "/"
      - get:
          url: "/api/health"
EOF

# Run load test
artillery run loadtest.yml
```

---

## 🎯 Production Deployment Checklist

### Pre-Deployment
- [ ] Server meets minimum requirements
- [ ] Domain configured and pointing to server
- [ ] SSL certificates obtained (if using HTTPS)
- [ ] Environment variables configured
- [ ] Firewall rules configured
- [ ] Backup strategy planned

### Deployment
- [ ] Deployment script executed successfully
- [ ] All services running and healthy
- [ ] Database migrations completed
- [ ] Game accessible via web browser
- [ ] WebSocket connections working
- [ ] Audio assets loading correctly

### Post-Deployment
- [ ] Monitoring tools configured
- [ ] Log rotation configured
- [ ] Backup automation setup
- [ ] Performance baseline established
- [ ] Team access and documentation provided

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
```bash
# Weekly tasks
./scripts/backup.sh                    # Create backup
docker system prune -f                 # Clean unused resources
./scripts/logs.sh all --since 7d       # Review logs

# Monthly tasks
apt update && apt upgrade               # System updates
docker-compose pull                     # Update base images
./scripts/restart.sh all                # Restart all services
```

### Emergency Procedures
```bash
# Emergency stop
./scripts/stop.sh

# Emergency restart
./scripts/restart.sh all

# Restore from backup
# (Refer to backup.sh script for restore procedures)
```

---

**🎉 Congratulations!** Your Underwater Fishing Game is now ready for production use!

**Need help?** Check the troubleshooting section or review the logs using the provided scripts.
