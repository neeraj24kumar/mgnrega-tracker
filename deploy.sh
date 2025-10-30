#!/bin/bash

# MGNREGA Performance Tracker Deployment Script
# This script sets up the application for production deployment

echo "🚀 Starting MGNREGA Performance Tracker Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install

# Install client dependencies and build
echo "📦 Installing client dependencies..."
cd client
npm install

echo "🔨 Building React application..."
npm run build

# Go back to root directory
cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p data logs

# Set up environment variables
echo "⚙️ Setting up environment variables..."
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=3000
NODE_ENV=production
DB_PATH=./data/mgnrega.db
DATA_GOV_API_KEY=579b464db66ec23bdd000001cdd3946e4d4b4a50f3027b1e4c6b61c8
LOG_LEVEL=info
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Set up PM2 for process management (if available)
if command -v pm2 &> /dev/null; then
    echo "📋 Setting up PM2 process manager..."
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'mgnrega-tracker',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF
    echo "✅ PM2 configuration created"
else
    echo "⚠️ PM2 not installed. Consider installing PM2 for production: npm install -g pm2"
fi

# Set up nginx configuration (if nginx is available)
if command -v nginx &> /dev/null; then
    echo "🌐 Creating nginx configuration..."
    cat > nginx.conf << EOF
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Serve static files directly
    location /static/ {
        alias /path/to/your/app/client/build/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    echo "✅ Nginx configuration created (update server_name and paths)"
else
    echo "⚠️ Nginx not installed. Consider installing nginx for reverse proxy"
fi

# Create systemd service file
echo "🔧 Creating systemd service file..."
cat > mgnrega-tracker.service << EOF
[Unit]
Description=MGNREGA Performance Tracker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/your/app
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF
echo "✅ Systemd service file created (update paths and user)"

# Create backup script
echo "💾 Creating backup script..."
cat > backup.sh << EOF
#!/bin/bash
# Backup script for MGNREGA Performance Tracker

BACKUP_DIR="/backup/mgnrega-tracker"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup database
cp data/mgnrega.db \$BACKUP_DIR/mgnrega_\$DATE.db

# Backup logs
tar -czf \$BACKUP_DIR/logs_\$DATE.tar.gz logs/

# Keep only last 7 days of backups
find \$BACKUP_DIR -name "*.db" -mtime +7 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: \$DATE"
EOF

chmod +x backup.sh
echo "✅ Backup script created"

# Create monitoring script
echo "📊 Creating monitoring script..."
cat > monitor.sh << EOF
#!/bin/bash
# Monitoring script for MGNREGA Performance Tracker

# Check if the application is running
if pgrep -f "node server.js" > /dev/null; then
    echo "✅ Application is running"
else
    echo "❌ Application is not running"
    # Restart the application
    if command -v pm2 &> /dev/null; then
        pm2 restart mgnrega-tracker
    else
        nohup node server.js > logs/app.log 2>&1 &
    fi
fi

# Check disk space
DISK_USAGE=\$(df -h / | awk 'NR==2 {print \$5}' | sed 's/%//')
if [ \$DISK_USAGE -gt 80 ]; then
    echo "⚠️ Disk usage is high: \$DISK_USAGE%"
fi

# Check memory usage
MEMORY_USAGE=\$(free | awk 'NR==2{printf "%.2f", \$3*100/\$2}')
if (( \$(echo "\$MEMORY_USAGE > 80" | bc -l) )); then
    echo "⚠️ Memory usage is high: \$MEMORY_USAGE%"
fi
EOF

chmod +x monitor.sh
echo "✅ Monitoring script created"

# Set up cron jobs
echo "⏰ Setting up cron jobs..."
cat > crontab.txt << EOF
# MGNREGA Performance Tracker Cron Jobs

# Run monitoring script every 5 minutes
*/5 * * * * /path/to/your/app/monitor.sh

# Run backup script daily at 2 AM
0 2 * * * /path/to/your/app/backup.sh

# Clean old logs weekly
0 3 * * 0 find /path/to/your/app/logs -name "*.log" -mtime +30 -delete
EOF

echo "✅ Cron jobs configuration created (update paths and run: crontab crontab.txt)"

# Final instructions
echo ""
echo "🎉 Deployment setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update the configuration files with your actual paths and domain"
echo "2. Copy the application to your server"
echo "3. Install dependencies: npm install && cd client && npm install && npm run build"
echo "4. Start the application:"
echo "   - With PM2: pm2 start ecosystem.config.js"
echo "   - With systemd: sudo systemctl enable mgnrega-tracker && sudo systemctl start mgnrega-tracker"
echo "   - Manually: node server.js"
echo "5. Configure nginx reverse proxy (if using nginx)"
echo "6. Set up SSL certificates for HTTPS"
echo "7. Configure firewall rules"
echo "8. Set up monitoring and alerting"
echo ""
echo "🔗 The application will be available at http://your-domain.com"
echo "📊 Health check: http://your-domain.com/health"
echo ""
echo "📚 For more information, see the README.md file"

