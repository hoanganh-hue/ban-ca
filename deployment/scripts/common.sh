#!/bin/bash

# Service Management Scripts for Underwater Fishing Game

# Configuration
DEPLOYMENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../"
ROOT_DIR="$(dirname "$DEPLOYMENT_DIR")"
COMPOSE_FILE="$DEPLOYMENT_DIR/docker-compose.production.yml"
ENV_FILE="$DEPLOYMENT_DIR/.env.production"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if running from correct directory
if [ ! -f "$COMPOSE_FILE" ]; then
    log_error "Docker compose file not found: $COMPOSE_FILE"
    log_info "Please run this script from the deployment directory"
    exit 1
fi

cd "$ROOT_DIR"
