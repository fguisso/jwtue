# JWTuê - Backend com Vulnerabilidade JWT

Este é o backend para o desafio de coding dojo de segurança, apresentando uma vulnerabilidade específica relacionada à verificação de assinatura de JWT.

## 🚨 Vulnerabilidade Implementada

**Problema**: Falta de verificação na assinatura do JWT (JWT Signature Verification Bypass)

**Localização**: Arquivo `index.js`, função `verifyToken()` (linha ~60)

**Descrição**: O servidor usa `jwt.decode()` em vez de `jwt.verify()`, permitindo que tokens falsificados sejam aceitos como válidos.

## 🏃‍♂️ Como Executar

```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`

## 📋 Endpoints

### POST /api/login
- **Descrição**: Autenticação de usuário
- **Body**: `{ "username": "admin", "password": "admin123" }`
- **Resposta**: Token JWT válido

### GET /api/songs
- **Descrição**: Lista músicas da Queen (requer autenticação)
- **Headers**: `Authorization: Bearer <token>`
- **Resposta**: Lista de músicas

### GET /api/health
- **Descrição**: Status do servidor
- **Resposta**: Status OK

## 👥 Usuários de Teste

- **admin/admin123** (role: admin)
- **user/user123** (role: user)

## 🎯 Como Explorar a Vulnerabilidade

1. **Faça login** com um usuário válido para obter um token JWT
2. **Decodifique o token** em [jwt.io](https://jwt.io) para ver o payload
3. **Modifique o payload** (ex: mude o role para "admin")
4. **Remova a assinatura** ou use uma assinatura falsa
5. **Use o token modificado** para acessar `/api/songs`

## 🔧 Como Corrigir

Substitua `jwt.decode(token)` por `jwt.verify(token, JWT_SECRET)` na função `verifyToken()`.

## 📚 Referências OWASP

Esta vulnerabilidade está relacionada ao **OWASP Top 10 A02:2021 - Cryptographic Failures** e **A07:2021 - Identification and Authentication Failures**. 