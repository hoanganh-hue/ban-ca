#!/bin/bash

# Show logs for Underwater Fishing Game services

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

show_usage() {
    echo "Usage: $0 [service] [options]"
    echo ""
    echo "Services:"
    echo "  nginx    - Web server logs"
    echo "  server   - Game server logs"
    echo "  client   - Client application logs"
    echo "  postgres - Database logs"
    echo "  redis    - Cache server logs"
    echo "  all      - All services (default)"
    echo ""
    echo "Options:"
    echo "  -f       - Follow logs (tail -f)"
    echo "  -n NUM   - Number of lines to show (default: 100)"
    echo "  --since  - Show logs since timestamp (e.g., '2h', '30m')"
    echo ""
    echo "Examples:"
    echo "  $0 server -f              # Follow server logs"
    echo "  $0 nginx -n 50             # Show last 50 nginx log lines"
    echo "  $0 all --since 1h          # Show all logs from last hour"
}

# Default values
SERVICE="all"
FOLLOW=""
LINES="100"
SINCE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--follow)
            FOLLOW="-f"
            shift
            ;;
        -n|--lines)
            LINES="$2"
            shift 2
            ;;
        --since)
            SINCE="--since $2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        nginx|server|client|postgres|redis|all)
            SERVICE="$1"
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Build docker-compose logs command
CMD="docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE logs --timestamps --tail=$LINES $FOLLOW $SINCE"

if [ "$SERVICE" != "all" ]; then
    CMD="$CMD $SERVICE"
fi

log_info "Showing logs for: $SERVICE"
log_info "Command: $CMD"
echo ""

# Execute the command
exec $CMD
