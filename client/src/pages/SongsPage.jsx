import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SongsPage.css';

const SongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchSongs(token);
  }, [navigate]);

  const fetchSongs = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/api/songs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        return;
      }

      const data = await response.json();
      setSongs(data.songs);
      setMessage(data.message);
    } catch (err) {
      setError('Erro ao carregar músicas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="songs-container">
        <div className="loading">Carregando músicas...</div>
      </div>
    );
  }

  return (
    <div className="songs-container">
      <header className="songs-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">
              <div className="logo-icon">J</div>
              <h1>JWTuê</h1>
            </div>
            <nav className="header-nav">
              <div className="nav-item active">Músicas</div>
              <div className="nav-item">Playlists</div>
              <div className="nav-item">Artistas</div>
            </nav>
          </div>
          
          <div className="user-info">
            <div className="user-avatar">
              {user ? getInitials(user.username) : 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.username}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <main className="songs-main">
        <div className="songs-header-info">
          <h2 className="songs-title">Músicas do Matuê</h2>
          <p className="songs-subtitle">{message}</p>
          <div className="songs-count">{songs.length} músicas encontradas</div>
        </div>

        <div className="songs-grid">
          {songs.map((song) => (
            <div key={song.id} className="song-card">
              <div className="song-cover">
                <img src={song.cover} alt={`Capa de ${song.title}`} />
                <div className="song-overlay">
                  <button className="play-button">▶</button>
                </div>
              </div>
              <div className="song-info">
                <h3 className="song-title">{song.title}</h3>
                <p className="song-artist">{song.artist}</p>
                <p className="song-album">{song.album}</p>
                <span className="song-duration">{song.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SongsPage; 