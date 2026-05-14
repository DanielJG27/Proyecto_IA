import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/styles.css';

const AuthModal = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin 
      ? { email, password } 
      : { username, email, password };

    try {
      const response = await fetch(`http://localhost:5220/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la autenticación');
      }

      if (isLogin) {
        login(data.token, data.user);
      } else {
        // If register success, switch to login
        setIsLogin(true);
        setError('Registro exitoso. Ahora puedes iniciar sesión.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <h2>{isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Inicia sesión para continuar tus estudios' : 'Únete para hacer seguimiento de tus hábitos'}
        </p>

        {error && <div className={`auth-error ${error.includes('exitoso') ? 'success' : ''}`}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label>Nombre de usuario</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Ej. EstudianteIA"
              />
            </div>
          )}
          
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="tu@correo.com"
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="auth-btn submit-btn" disabled={loading}>
            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
