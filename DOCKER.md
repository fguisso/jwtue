# 🐳 Docker - JWTuê

Este documento explica como executar o projeto JWTuê usando Docker.

## 📋 Pré-requisitos

- Docker instalado e rodando
- Porta 3001 disponível

## 🚀 Execução Rápida

### Opção 1: Usando o script automatizado
```bash
./docker-build.sh
```

### Opção 2: Comandos manuais

#### 1. Construir a imagem
```bash
docker build -t jwtue-security .
```

#### 2. Executar o container
```bash
docker run -p 3001:3001 jwtue-security
```

## 📝 Comandos Úteis

### Execução
```bash
# Executar em primeiro plano
docker run -p 3001:3001 jwtue-security

# Executar em background
docker run -d -p 3001:3001 jwtue-security

# Executar com nome personalizado
docker run -d -p 3001:3001 --name jwtue-app jwtue-security
```

### Gerenciamento
```bash
# Listar containers rodando
docker ps

# Ver logs
docker logs <container_id>

# Ver logs em tempo real
docker logs -f <container_id>

# Parar container
docker stop <container_id>

# Remover container
docker rm <container_id>

# Executar comando no container
docker exec -it <container_id> sh
```

### Imagens
```bash
# Listar imagens
docker images

# Remover imagem
docker rmi jwtue-security

# Forçar rebuild (sem cache)
docker build --no-cache -t jwtue-security .
```

## 🌐 Acesso

Após executar o container, acesse:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3001/api/health
- **Login**: http://localhost:3001

## 👥 Usuários de Teste

- **admin** / **admin123** (role: admin)
- **user** / **user123** (role: user)

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# Executar com variáveis personalizadas
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  jwtue-security
```

### Volumes (para desenvolvimento)
```bash
# Montar código fonte para desenvolvimento
docker run -p 3001:3001 \
  -v $(pwd)/server:/app/server \
  -v $(pwd)/client:/app/client \
  jwtue-security
```

## 🏗️ Estrutura do Dockerfile

### Multi-stage Build
1. **Builder Stage**: Instala dependências e constrói o frontend
2. **Production Stage**: Copia apenas os arquivos necessários

### Otimizações
- ✅ Node.js 24 Alpine (imagem menor)
- ✅ Multi-stage build
- ✅ Dependências de produção apenas
- ✅ Health check
- ✅ Cache de layers otimizado

## 🐛 Troubleshooting

### Problemas Comuns

#### Porta já em uso
```bash
# Verificar se a porta está em uso
lsof -i :3001

# Usar porta alternativa
docker run -p 3002:3001 jwtue-security
```

#### Permissões
```bash
# Dar permissão ao script
chmod +x docker-build.sh
```

#### Limpeza
```bash
# Limpar containers parados
docker container prune

# Limpar imagens não utilizadas
docker image prune

# Limpeza completa
docker system prune -a
```

## 📊 Monitoramento

### Health Check
O container inclui health check automático:
```bash
# Verificar status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Logs
```bash
# Ver logs completos
docker logs <container_id>

# Ver últimas 50 linhas
docker logs --tail 50 <container_id>

# Ver logs com timestamp
docker logs -t <container_id>
```

## 🔒 Segurança

⚠️ **Importante**: Este container contém vulnerabilidades intencionais para fins educacionais. Não use em produção!

### Recomendações para Produção
- Use secrets para chaves JWT
- Implemente rate limiting
- Configure HTTPS
- Use usuários não-root no container
- Implemente logging adequado

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Node.js Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Multi-stage Builds](https://docs.docker.com/develop/dev-best-practices/multistage-build/) 