
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormLogin() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/login', { correo, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Bienvenido ${user.nombre}`);

      switch (user.rol) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'docente':
          navigate('/docente-dashboard');
          break;
        case 'estudiante':
          navigate('/estudiante-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error de conexión';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.warn('Por favor ingresa tu correo electrónico.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/reset-password', { correo: resetEmail });
      toast.success('Si el correo está registrado, recibirás instrucciones.');
      setShowResetPassword(false);
      setResetEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al enviar la solicitud');
    }
  };

  return (
  <>
    <ToastContainer position="top-center" autoClose={3000} />
    {!showResetPassword ? (
      <form onSubmit={handleLogin} autoComplete="off" noValidate>
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
              onClick={() => setShowPassword(!showPassword)}
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
          disabled={isLoading}
          className="btn btn-secondary w-100 py-2 fw-semibold"
          style={{ fontSize: '0.9rem' }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Procesando...
            </>
          ) : 'Iniciar sesión'}
        </button>
      </form>
    ) : (
      <form onSubmit={handleReset} autoComplete="off" noValidate>
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
