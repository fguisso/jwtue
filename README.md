<img width="1240" height="393" alt="image" src="https://github.com/user-attachments/assets/20ada158-4620-432f-a9d6-42bb402734df" />

## 🎯 O Desafio

Este é um desafio de desenvolvimento seguro que demonstra uma vulnerabilidade real de **verificação de assinatura JWT** em uma API Node.js. O cenário simula um serviço de autenticação que implementou um sistema de tokens JWT para controle de acesso, mas falhou na verificação adequada das assinaturas.

### Impacto

- **Elevação de Privilégios**: Usuários comuns podem se passar por administradores
- **Acesso Não Autorizado**: Tokens falsificados permitem acesso a recursos restritos
- **Bypass de Autenticação**: Controle de acesso completamente comprometido
- **Violação de Integridade**: Dados podem ser manipulados sem detecção

### Narrativa

Você é um pentester contratado para avaliar a segurança de uma nova API de músicas. O cliente suspeita que há uma vulnerabilidade no sistema de autenticação que pode permitir acesso não autorizado. Sua missão é identificar e explorar essa falha para demonstrar o impacto real.

### 📋 Sua Missão

1. **Reconhecimento**: Entender como a autenticação funciona
2. **Identificação**: Descobrir a vulnerabilidade de verificação JWT
3. **Exploração**: Criar tokens falsificados com diferentes roles
4. **Elevação de Privilégios**: Acessar recursos restritos como admin
5. **Documentação**: Registrar o processo e impacto

## 🚀 Começando

### Pré-requisitos

- Docker
- curl

### 1. Preparar o Ambiente

#### Opção 1: Setup Automático (Recomendado)

```bash
# Clonar o repositório
git clone https://github.com/seu_usuario/jwtue.git
cd jwtue

# Build da imagem Docker
docker build -t jwtue-security .

# Executar o container
docker run -d -p 3000:3000 -p 3001:3001 --name jwtue-test jwtue-security
```

<details>
<summary>Opção 2: Setup Local</summary>

```bash
# Clonar o repositório
git clone https://github.com/seu_usuario/jwtue.git
cd jwtue

# Instalar dependências do backend
cd server && npm install

# Instalar dependências do frontend
cd ../client && npm install

# Executar backend (terminal 1)
cd ../server && npm start

# Executar frontend (terminal 2)
cd ../client && npm run dev
```

</details>

A aplicação estará disponível em:

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`

### 2. Endpoints Disponíveis

- `POST /api/login` - Autenticação de usuário
- `GET /api/songs` - Listar músicas (requer autenticação)

### 3. Usuários de Teste

- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

## 🔍 Explorando como um Pentester

### Teste Inicial

Vamos começar com uma autenticação normal para entender o comportamento da API:

```bash
# Login como usuário comum
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user123"}'
```

### Análise do Token

O token retornado é um JWT. Vamos decodificá-lo para entender sua estrutura:

Use o site https://jwt.io ou sua ferramenta favorita para decode/encode de jwt.

### 🔎 O que Procurar

Analise o token procurando por:

- Claims de usuário (userId, username, role)
- Timestamp de expiração (exp)
- Estrutura do payload
- Possíveis campos manipuláveis

### Teste de Elevação de Privilégios

Agora vamos tentar criar um token falsificado com role de admin:

```bash
# Alterar as claims do JWT sem se importar com a assinatura
{
  "userId": 2,
  "username": "user", // tente trocar por admin
  "role": "user",
  "iat": 1752710992,
  "exp": 1752714592
}
```

### Teste de Acesso Não Autorizado

Use o token falsificado para acessar recursos restritos:

```bash
# Tentar acessar músicas com token falsificado
curl -X GET http://localhost:3001/api/songs \
  -H "Authorization: Bearer SEU_TOKEN_FALSIFICADO"
```

## 💡 Dicas para a Correção

<details>
  <summary>Dica Nível 1: Onde está o problema?</summary>
  A vulnerabilidade está na função `verifyToken` no arquivo `server/index.js`. Examine como o token é validado e qual método está sendo usado para decodificação.
</details>

<details>
  <summary>Dica Nível 2: Qual é a diferença entre os métodos?</summary>
  Compare `jwt.decode()` com `jwt.verify()`. O primeiro apenas decodifica o token, enquanto o segundo verifica tanto a estrutura quanto a assinatura digital usando a chave secreta.
</details>

## ✅ Soluções Possíveis

<details>
  <summary>Solução 1: Corrigindo a Verificação JWT</summary>

  A correção principal é substituir `jwt.decode()` por `jwt.verify()` para garantir que a assinatura seja validada.

  **Correção:**

  ```javascript
  // ANTES (vulnerável)
  const decoded = jwt.decode(token);
  
  // DEPOIS (seguro)
  const decoded = jwt.verify(token, JWT_SECRET);
  ```

  **Por quê?** O `jwt.verify()` verifica automaticamente:

- Estrutura válida do token
- Assinatura digital correta
- Expiração do token
- Outros claims de segurança

</details>

<details>
  <summary>Solução 2: Implementação Robusta de Segurança</summary>

  Além da correção básica, implemente medidas adicionais de segurança:

  **Melhorias:**

  ```javascript
  // Verificação com opções de segurança
  const decoded = jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS256'], // Restringir algoritmos permitidos
    issuer: 'jwtue-api',   // Verificar issuer
    audience: 'jwtue-app'  // Verificar audience
  });
  
  // Validação adicional de claims
  if (!decoded.role || !['user', 'admin'].includes(decoded.role)) {
    throw new Error('Role inválido');
  }
  ```
  
  **Benefícios:**

- Previne ataques de algoritmo confuso
- Validação rigorosa de claims
- Logs de auditoria para tentativas de bypass
- Segurança em camadas

</details>

## ⚠️ Aviso Importante

**ATENÇÃO**: Este projeto é **APENAS para fins educacionais**. A vulnerabilidade foi intencionalmente implementada para demonstrar conceitos de segurança JWT. Nunca use este código em produção ou em sistemas reais.

## 📚 Recursos Adicionais

- [JWT.io](https://jwt.io/) - Ferramenta para debug e análise de JWT
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - Especificação oficial do JWT
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet_for_Java.html)
- [Node.js jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Documentação da biblioteca

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você encontrou uma nova técnica de exploração ou tem sugestões de melhorias, abra uma issue ou pull request.

> Este desafio é um presente para o [@00lucasm](https://github.com/00lucasm) em retribuição as talks dele sobre vulnerabilidades em JWT. Acompanhem os conteúdo do jovem que vale a pena.
