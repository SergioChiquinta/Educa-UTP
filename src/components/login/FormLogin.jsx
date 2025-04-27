
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FormLogin() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { correo, password });

      const { token, rol } = response.data;

      localStorage.setItem('token', token);

      // Redirigir según el rol
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

  return (
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
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <i className="fas fa-eye-slash input-icon password" style={{ top: '75%' }}></i>
      </div>

      {/* Reset password link */}
      <div className="text-end mb-4">
        <a href="#" className="text-secondary fw-medium text-decoration-none">
          Restablecer contraseña
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
  );
}

export default FormLogin;
