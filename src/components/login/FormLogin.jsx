
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FormLogin() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { correo, password });
      const { token, rol } = response.data;
      localStorage.setItem('token', token);

      if (rol === 'admin') {
        navigate('/admin-dashboard');
      } else if (rol === 'docente') {
        navigate('/docente-dashboard');
      } else if (rol === 'estudiante') {
        navigate('/estudiante-dashboard');
      }
    } catch (error) {
      console.error('Error de inicio de sesión', error.response?.data?.message || error.message);
      alert('Correo o contraseña incorrectos');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/reset-password', { correo: resetEmail });
      alert('Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.');
      setShowResetPassword(false);
      setResetEmail('');
    } catch (error) {
      console.error('Error al restablecer contraseña', error.response?.data?.message || error.message);
      alert('Error al intentar restablecer la contraseña.');
    }
  };

  return (
    <>
      {!showResetPassword ? (
        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          {/* Email field */}
          <div className="mb-3 position-relative">
            <label htmlFor="correo" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              className="form-control border-primary"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <i className="fas fa-user input-icon" style={{ top: '75%' }}></i>
          </div>

          {/* Password field */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label fw-semibold">
              Contraseña
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={togglePasswordVisibility}
              >
                <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </span>
            </div>
          </div>

          {/* Reset password link */}
          <div className="text-end mb-4">
            <a
              href="#"
              className="text-secondary fw-medium text-decoration-none"
              onClick={() => setShowResetPassword(true)}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-secondary w-100 py-2 fw-semibold"
            style={{ fontSize: '0.9rem' }}
          >
            Iniciar sesión
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} autoComplete="off" noValidate>
          <h5 className="text-center mb-4">Restablecer contraseña</h5>

          {/* Reset Email field */}
          <div className="mb-3 position-relative">
            <label htmlFor="resetEmail" className="form-label fw-semibold">
              Ingresa tu correo
            </label>
            <input
              type="email"
              className="form-control border-primary"
              id="resetEmail"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowResetPassword(false)}
            >
              Volver
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Enviar
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default FormLogin;
