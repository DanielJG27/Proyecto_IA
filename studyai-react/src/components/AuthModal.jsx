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

  // Initial study habits fields
  const [studyHours, setStudyHours] = useState('2');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [concentrationLevel, setConcentrationLevel] = useState('Medio');
  const [otherVariables, setOtherVariables] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin 
      ? { email, password } 
      : { 
          username, 
          email, 
          password,
          studyHours: parseFloat(studyHours) || 0,
          daysPerWeek: parseInt(daysPerWeek) || 0,
          concentrationLevel,
          otherVariables
        };

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
      <div className="auth-modal" style={{ maxWidth: !isLogin ? '440px' : '400px' }}>
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

          {!isLogin && (
            <>
              <div className="auth-divider-title">Perfil de Hábitos</div>

              <div className="form-row">
                <div className="input-group">
                  <label>Horas de estudio al día</label>
                  <input 
                    type="number" 
                    value={studyHours} 
                    onChange={(e) => setStudyHours(e.target.value)} 
                    required 
                    min="0.5" 
                    max="24" 
                    step="0.5"
                    placeholder="Ej. 2"
                  />
                </div>

                <div className="input-group">
                  <label>Días por semana</label>
                  <select 
                    value={daysPerWeek} 
                    onChange={(e) => setDaysPerWeek(e.target.value)}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                      <option key={d} value={d}>{d} {d === 1 ? 'día' : 'días'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Nivel de concentración</label>
                <select 
                  value={concentrationLevel} 
                  onChange={(e) => setConcentrationLevel(e.target.value)}
                  required
                >
                  <option value="Bajo">Bajo (Fácil distracción)</option>
                  <option value="Medio">Medio (Enfoque moderado)</option>
                  <option value="Alto">Alto (Enfoque profundo / Flujo)</option>
                </select>
              </div>

              <div className="input-group">
                <label>Otras variables / Observaciones</label>
                <textarea 
                  value={otherVariables} 
                  onChange={(e) => setOtherVariables(e.target.value)} 
                  placeholder="Ej. Prefiero estudiar de noche, necesito ruido blanco..."
                  rows="2"
                  style={{ resize: 'none' }}
                />
              </div>
            </>
          )}

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
}

export default AuthModal;
