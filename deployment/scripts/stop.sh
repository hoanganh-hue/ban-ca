#!/bin/bash

# Stop services for Underwater Fishing Game

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

show_usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --volumes    - Remove volumes (WARNING: This will delete all data!)"
    echo "  --images     - Remove Docker images"
    echo "  --all        - Remove everything (containers, volumes, images, networks)"
    echo "  -h, --help   - Show this help"
    echo ""
    echo "Examples:"
    echo "  $0                     # Stop services only"
    echo "  $0 --volumes           # Stop services and remove volumes (DELETE DATA!)"
    echo "  $0 --all               # Complete cleanup (DELETE EVERYTHING!)"
}

REMOVE_VOLUMES=false
REMOVE_IMAGES=false
REMOVE_ALL=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --volumes)
            REMOVE_VOLUMES=true
            shift
            ;;
        --images)
            REMOVE_IMAGES=true
            shift
            ;;
        --all)
            REMOVE_ALL=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Confirmation for destructive operations
if [ "$REMOVE_VOLUMES" = true ] || [ "$REMOVE_ALL" = true ]; then
    log_warning "WARNING: This will permanently delete all database data and uploaded files!"
    echo "Are you sure you want to continue? Type 'DELETE' to confirm:"
    read -r confirmation
    if [ "$confirmation" != "DELETE" ]; then
        log_info "Operation cancelled."
        exit 0
    fi
fi

log_info "Stopping Underwater Fishing Game services..."

# Stop services
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down

if [ "$REMOVE_ALL" = true ]; then
    log_info "Removing everything (containers, volumes, images, networks)..."
    docker-compose -f "$COMPOSE_FILE" down --volumes --rmi all
    
    # Remove any remaining game-related containers
    docker rm -f $(docker ps -aq --filter name=underwater_game) 2>/dev/null || true
    
    # Remove game networks
    docker network rm $(docker network ls --filter name=game --format "{{.Name}}") 2>/dev/null || true
    
elif [ "$REMOVE_VOLUMES" = true ]; then
    log_info "Removing volumes (this will delete all data)..."
    docker-compose -f "$COMPOSE_FILE" down --volumes
    
elif [ "$REMOVE_IMAGES" = true ]; then
    log_info "Removing Docker images..."
    docker-compose -f "$COMPOSE_FILE" down --rmi all
fi

# Clean up any orphaned containers
docker container prune -f >/dev/null 2>&1 || true

log_success "Services stopped successfully"

if [ "$REMOVE_ALL" = true ] || [ "$REMOVE_VOLUMES" = true ]; then
    log_warning "All data has been removed. You will need to run the full deployment script to start fresh."
else
    log_info "To start services again, run: ./deploy.sh"
fi
