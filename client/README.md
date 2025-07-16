# JWTuê - Frontend React

Frontend para o desafio de coding dojo de segurança, com interface estilo Spotify para demonstrar a vulnerabilidade JWT.

## 🚀 Como Executar

```bash
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🎨 Design

- **Tema**: Escuro estilo Spotify
- **Cores principais**:
  - Fundo: `#121212`
  - Verde Spotify: `#1DB954`
  - Texto: `#FFFFFF`
  - Texto secundário: `#b3b3b3`

## 📱 Funcionalidades

### Página de Login (`/`)
- Formulário de autenticação
- Usuários de teste exibidos na interface
- Design responsivo
- Feedback visual de erros

### Dashboard (`/dashboard`)
- Lista de músicas do Matuê
- Cards com capas dos álbuns
- Efeitos hover estilo Spotify
- Botão de logout
- Proteção de rota (redireciona para login se não autenticado)

## 🔧 Tecnologias

- **React 18** com Vite
- **React Router DOM** para navegação
- **CSS Modules** para estilização
- **Fetch API** para comunicação com backend

## 📁 Estrutura

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
│   ├── LoginPage.jsx   # Página de login
│   └── SongsPage.jsx   # Dashboard com músicas
├── styles/             # Arquivos CSS
│   ├── LoginPage.css   # Estilos da página de login
│   └── SongsPage.css   # Estilos do dashboard
├── App.jsx             # Componente principal com rotas
└── index.css           # Estilos globais
```

## 🔐 Autenticação

- Usa localStorage para armazenar token JWT
- Redirecionamento automático baseado no status de autenticação
- Headers de autorização automáticos para requisições

## 🎯 Vulnerabilidade

Este frontend consome a API do backend que possui a vulnerabilidade de não verificar a assinatura do JWT. Para testar:

1. Faça login com um usuário válido
2. Capture o token JWT
3. Modifique o payload do token (ex: mude o role)
4. Use o token modificado para acessar o dashboard
