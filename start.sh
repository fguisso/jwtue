#!/bin/sh

echo "🚀 Starting JWTuê - Desafio de Segurança JWT"
echo "📝 Backend: http://localhost:3001"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "⚠️  VULNERABILIDADE: O servidor não verifica a assinatura do JWT!"
echo "   Use jwt.decode() em vez de jwt.verify()"
echo ""

# Iniciar o backend na porta 3001
cd /app/server && npm start &

# Iniciar o frontend na porta 3000
cd /app/client && npx serve -s dist -l 3000 &

# Aguardar ambos os processos
wait 