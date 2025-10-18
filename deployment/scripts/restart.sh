#!/bin/bash

# Restart services for Underwater Fishing Game

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

show_usage() {
    echo "Usage: $0 [service]"
    echo ""
    echo "Services:"
    echo "  nginx    - Web server"
    echo "  server   - Game server"
    echo "  client   - Client application"
    echo "  postgres - Database"
    echo "  redis    - Cache server"
    echo "  all      - All services (default)"
    echo ""
    echo "Examples:"
    echo "  $0 server              # Restart game server only"
    echo "  $0 all                 # Restart all services"
}

SERVICE="all"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        nginx|server|client|postgres|redis|all)
            SERVICE="$1"
            shift
            ;;
        *)
            log_error "Unknown service: $1"
            show_usage
            exit 1
            ;;
    esac
done

log_info "Restarting service: $SERVICE"

if [ "$SERVICE" = "all" ]; then
    log_info "Stopping all services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    
    log_info "Starting all services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
else
    log_info "Restarting $SERVICE..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart "$SERVICE"
fi

log_success "Service restart completed: $SERVICE"
log_info "Use './scripts/status.sh' to check service health"
