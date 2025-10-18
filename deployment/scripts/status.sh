#!/bin/bash

# Status check for Underwater Fishing Game services

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

log_info "Checking service status..."
echo ""

# Show docker-compose services status
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps

echo ""
log_info "Service health checks:"

# Check individual services
services=("nginx" "server" "client" "postgres" "redis")

for service in "${services[@]}"; do
    container_name="underwater_game_${service}"
    if [ "$service" = "server" ]; then
        container_name="underwater_game_server"
    elif [ "$service" = "client" ]; then
        container_name="underwater_game_client"
    elif [ "$service" = "postgres" ]; then
        container_name="underwater_game_db"
    fi
    
    if docker ps --filter "name=$container_name" --format "table {{.Names}}\t{{.Status}}" | grep -q "Up"; then
        health=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "no-healthcheck")
        if [ "$health" = "healthy" ]; then
            log_success "$service: Running (Healthy)"
        elif [ "$health" = "unhealthy" ]; then
            log_error "$service: Running (Unhealthy)"
        else
            log_warning "$service: Running (No health check)"
        fi
    else
        log_error "$service: Not running"
    fi
done

echo ""
log_info "System resources:"

# Show resource usage
echo "=== Docker System Info ==="
docker system df

echo ""
echo "=== Container Resource Usage ==="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

echo ""
log_info "Network status:"
echo "=== Docker Networks ==="
docker network ls | grep game

echo ""
log_info "Volume status:"
echo "=== Docker Volumes ==="
docker volume ls | grep -E "postgres|redis|nginx|server"
