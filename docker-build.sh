#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 JWTuê - Docker Build Script${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando. Inicie o Docker e tente novamente.${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${YELLOW}🔨 Construindo imagem Docker...${NC}"
docker build -t jwtue-security .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Imagem construída com sucesso!${NC}"
    echo ""
    echo -e "${BLUE}🚀 Para executar o projeto:${NC}"
    echo -e "${GREEN}docker run -p 3001:3001 jwtue-security${NC}"
    echo ""
    echo -e "${BLUE}📝 Comandos úteis:${NC}"
    echo -e "  • Executar: ${GREEN}docker run -p 3001:3001 jwtue-security${NC}"
    echo -e "  • Executar em background: ${GREEN}docker run -d -p 3001:3001 jwtue-security${NC}"
    echo -e "  • Ver logs: ${GREEN}docker logs <container_id>${NC}"
    echo -e "  • Parar container: ${GREEN}docker stop <container_id>${NC}"
    echo ""
    echo -e "${BLUE}🌐 Acesse:${NC}"
    echo -e "  • Frontend: ${GREEN}http://localhost:3001${NC}"
    echo -e "  • Backend API: ${GREEN}http://localhost:3001/api/health${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Lembre-se: Este projeto contém vulnerabilidades intencionais para fins educacionais!${NC}"
else
    echo -e "${RED}❌ Erro ao construir a imagem Docker.${NC}"
    exit 1
fi 