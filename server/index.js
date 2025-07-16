const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Chave secreta para assinar JWT (em produção deveria estar em variável de ambiente)
const JWT_SECRET = 'super-secret-key-123';

// Dados mockados de usuários
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Dados mockados de músicas
const songs = [
  {
    id: 1,
    title: 'Kenny G',
    artist: 'Matuê',
    album: 'Máquina do Tempo',
    duration: '2:44',
    cover: 'https://ia801909.us.archive.org/21/items/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308-27238402518_thumb250.jpg' // exemplo
  },
  {
    id: 2,
    title: 'V de Vilão',
    artist: 'Matuê',
    album: '333',
    duration: '2:26',
    cover: 'https://archive.org/download/mbid-fe4d47ce-0e2f-45ad-a932-582e23c2eca5/mbid-fe4d47ce-0e2f-45ad-a932-582e23c2eca5-39872672117_thumb250.jpg' // exemplo
  },
  {
    id: 3,
    title: 'Anos Luz',
    artist: 'Matuê',
    album: 'Máquina do Tempo',
    duration: '2:55',
    cover: 'https://ia801909.us.archive.org/21/items/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308-27238402518_thumb250.jpg' // exemplo
  },
  {
    id: 4,
    title: '777-666',
    artist: 'Matuê',
    album: 'Máquina do Tempo',
    duration: '2:36',
    cover: 'https://ia801909.us.archive.org/21/items/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308-27238402518_thumb250.jpg' // exemplo
  },
  {
    id: 5,
    title: 'Groupies',
    artist: 'Matuê',
    album: 'Máquina do Tempo',
    duration: '2:38',
    cover: 'https://ia801909.us.archive.org/21/items/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308-27238402518_thumb250.jpg' // exemplo
  },
  {
    id: 6,
    title: 'A Morte do Autotune',
    artist: 'Matuê',
    album: 'Máquina do Tempo',
    duration: '2:36',
    cover: 'https://ia801909.us.archive.org/21/items/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308/mbid-c5f02cd5-4b03-40ab-93ba-18b1520e6308-27238402518_thumb250.jpg' // exemplo
  }
];

// Endpoint de login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Buscar usuário
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Criar payload do JWT
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role
  };

  // Gerar JWT com a chave secreta
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  res.json({
    message: 'Login realizado com sucesso',
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

// Middleware para verificar JWT (COM VULNERABILIDADE)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Verificar se o token expirou
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: 'Token expirado' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Endpoint protegido para listar músicas
app.get('/api/songs', verifyToken, (req, res) => {
  // Log para debug (mostra informações do usuário autenticado)
  console.log('Usuário get songs:', req.user);

  let filteredSongs = songs;

  // Filtrar músicas baseado no role do usuário
  if (req.user.role === 'user') {
    // Usuário comum vê apenas o álbum "333"
    filteredSongs = songs.filter(song => song.album === '333');
  }

  // Admin vê todas as músicas (não filtra)
  res.json({
    message: req.user.role == 'admin' ? 'Todas as músicas do Matuê' : 'Músicas do álbum 333',
    songs: filteredSongs,
    user: req.user.username
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Endpoints disponíveis:`);
  console.log(`   POST /api/login - Login de usuário`);
  console.log(`   GET  /api/songs - Listar músicas (requer autenticação)`);
  console.log(`🎨 Frontend: http://localhost:3000`);
}); 
