#!/bin/bash

# Database Backup Script for Underwater Fishing Game
# Creates timestamped backups of PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="underwater_game_backup_${DATE}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"
RETENTION_DAYS=7

# Database connection info (from environment)
DB_NAME=${POSTGRES_DB}
DB_USER=${POSTGRES_USER}
DB_HOST="postgres"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${YELLOW}[WARNING]${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to perform backup
perform_backup() {
    log_info "Starting database backup..."
    
    # Test database connection
    if ! pg_isready -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
        log_error "Cannot connect to database. Backup failed."
        exit 1
    fi
    
    # Create backup
    if pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILE"; then
        log_info "Database backup created: $BACKUP_FILE"
        
        # Compress backup
        if gzip "$BACKUP_DIR/$BACKUP_FILE"; then
            log_info "Backup compressed: $COMPRESSED_FILE"
        else
            log_warning "Failed to compress backup, but backup file exists"
        fi
    else
        log_error "Database backup failed"
        exit 1
    fi
}

# Function to clean old backups
clean_old_backups() {
    log_info "Cleaning old backups (keeping last $RETENTION_DAYS days)..."
    
    # Find and remove old backup files
    find "$BACKUP_DIR" -name "underwater_game_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "underwater_game_backup_*.sql" -type f -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    # Count remaining backups
    local backup_count=$(find "$BACKUP_DIR" -name "underwater_game_backup_*.sql*" -type f | wc -l)
    log_info "$backup_count backup files remaining"
}

# Function to show backup status
show_backup_info() {
    local file_path="$BACKUP_DIR/$COMPRESSED_FILE"
    if [ -f "$file_path" ]; then
        local file_size=$(du -h "$file_path" | cut -f1)
        log_info "Backup completed successfully!"
        log_info "File: $COMPRESSED_FILE"
        log_info "Size: $file_size"
        log_info "Location: $BACKUP_DIR"
    else
        log_error "Backup file not found: $file_path"
    fi
}

# Main backup process
main() {
    log_info "=== Database Backup Started ==="
    
    perform_backup
    clean_old_backups
    show_backup_info
    
    log_info "=== Database Backup Completed ==="
}

# Run backup
main "$@"
