# Multi-stage build para otimizar o tamanho da imagem
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copiar package.json dos dois projetos
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Instalar dependências
RUN cd server && npm install
RUN cd client && npm install

# Copiar código fonte
COPY server/ ./server/
COPY client/ ./client/

# Build do frontend
RUN cd client && npm run build

# Imagem de produção
FROM node:24-alpine AS production

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Copiar package.json e instalar apenas dependências de produção do backend
COPY server/package*.json ./server/
RUN cd server && npm install --only=production

# Copiar código do backend e build do frontend
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

# Copiar script de inicialização
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expor ambas as portas
EXPOSE 3000 3001

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001
ENV FRONTEND_PORT=3000

# Healthcheck para o backend
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Comando de inicialização
CMD ["/app/start.sh"] 