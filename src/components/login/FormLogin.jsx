
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
          navigate('/admin/dashboard');
          break;
        case 'docente':
          navigate('/docente/recursos');
          break;
        case 'estudiante':
          navigate('/estudiante/buscar');
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
    <div className="max-w-sm mx-auto mt-12 p-8 bg-white shadow-md rounded-lg">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        {showResetPassword ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
      </h2>

      {!showResetPassword ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => setShowResetPassword(true)}
              className="text-indigo-600 hover:text-indigo-500"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Procesando...
              </>
            ) : 'Iniciar Sesión'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="resetEmail"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowResetPassword(false)}
              className="w-1/2 py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Enviar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FormLogin;
