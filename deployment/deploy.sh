#!/bin/bash

# Underwater Fishing Game - Production Deployment Script
# Run this script to deploy the game in production environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$DEPLOYMENT_DIR")"
BACKUP_DIR="$DEPLOYMENT_DIR/backups"
LOGS_DIR="$DEPLOYMENT_DIR/logs"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    log_success "System requirements check passed"
}

setup_directories() {
    log_info "Setting up deployment directories..."
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOGS_DIR"
    mkdir -p "$DEPLOYMENT_DIR/ssl"
    
    # Set proper permissions
    chmod 755 "$BACKUP_DIR"
    chmod 755 "$LOGS_DIR"
    
    log_success "Directories setup completed"
}

check_environment() {
    log_info "Checking environment configuration..."
    
    if [ ! -f "$DEPLOYMENT_DIR/.env.production" ]; then
        log_error "Production environment file not found: $DEPLOYMENT_DIR/.env.production"
        log_info "Please copy .env.production.example to .env.production and configure it"
        exit 1
    fi
    
    # Check for default passwords (security check)
    if grep -q "CHANGE_THIS" "$DEPLOYMENT_DIR/.env.production"; then
        log_warning "Default passwords/secrets detected in .env.production"
        log_warning "Please update all CHANGE_THIS values with secure passwords"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled. Please update your environment configuration."
            exit 1
        fi
    fi
    
    log_success "Environment configuration check passed"
}

build_images() {
    log_info "Building Docker images..."
    
    cd "$ROOT_DIR"
    
    # Build images with production configuration
    docker-compose -f deployment/docker-compose.production.yml build --no-cache
    
    log_success "Docker images built successfully"
}

start_services() {
    log_info "Starting production services..."
    
    cd "$ROOT_DIR"
    
    # Start services in production mode
    docker-compose -f deployment/docker-compose.production.yml --env-file deployment/.env.production up -d
    
    log_success "Services started successfully"
}

wait_for_services() {
    log_info "Waiting for services to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f deployment/docker-compose.production.yml ps | grep -q "Up (healthy)"; then
            log_success "Services are ready!"
            return 0
        fi
        
        log_info "Attempt $attempt/$max_attempts - Services starting..."
        sleep 5
        ((attempt++))
    done
    
    log_warning "Services took longer than expected to start. Check logs if issues persist."
}

run_database_migrations() {
    log_info "Running database migrations..."
    
    cd "$ROOT_DIR"
    
    # Run Prisma migrations in the server container
    docker-compose -f deployment/docker-compose.production.yml exec server npm run db:migrate
    
    log_success "Database migrations completed"
}

show_deployment_info() {
    log_success "🎉 Underwater Fishing Game deployed successfully!"
    echo ""
    echo "=================================================="
    echo "    DEPLOYMENT INFORMATION"
    echo "=================================================="
    echo "🌐 Game URL: http://localhost (or your domain)"
    echo "📊 Admin API: http://localhost/api"
    echo "🔍 Health Check: http://localhost/health"
    echo ""
    echo "📁 Deployment Directory: $DEPLOYMENT_DIR"
    echo "💾 Backups Directory: $BACKUP_DIR"
    echo "📋 Logs Directory: $LOGS_DIR"
    echo ""
    echo "=================================================="
    echo "    USEFUL COMMANDS"
    echo "=================================================="
    echo "📋 View logs: ./scripts/logs.sh"
    echo "🔄 Restart services: ./scripts/restart.sh"
    echo "🛑 Stop services: ./scripts/stop.sh"
    echo "💾 Backup database: ./scripts/backup.sh"
    echo "📊 Service status: ./scripts/status.sh"
    echo ""
    log_info "Deployment completed! Your game is now running."
}

cleanup_on_error() {
    log_error "Deployment failed. Cleaning up..."
    cd "$ROOT_DIR"
    docker-compose -f deployment/docker-compose.production.yml down
}

# Main deployment process
main() {
    echo "=================================================="
    echo "   UNDERWATER FISHING GAME DEPLOYMENT"
    echo "=================================================="
    echo ""
    
    # Set error trap
    trap cleanup_on_error ERR
    
    check_requirements
    setup_directories
    check_environment
    build_images
    start_services
    wait_for_services
    run_database_migrations
    show_deployment_info
}

# Run main function
main "$@"
