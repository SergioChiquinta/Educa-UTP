
import React from 'react';

function FormLogin() {
  return (
    <form autoComplete="off" noValidate>
      {/* Email field */}
      <div className="mb-3 position-relative">
        <label htmlFor="codigo-utp" className="form-label fw-semibold">
          Email
        </label>
        <input
          type="text"
          className="form-control border-primary"
          id="codigo-utp"
          aria-describedby="codigo-utp-help"
          defaultValue="#"
        />
        <i className="fas fa-user input-icon" style={{ top: '50%' }}></i>
        <div
          id="codigo-utp-help"
          className="info-text d-flex align-items-center mt-1"
        >
          <i className="fas fa-info-circle"></i>
          Ejemplo de usuario: ...
        </div>
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
          defaultValue="a"
        />
        <i className="fas fa-eye-slash input-icon password" style={{ top: '70%' }}></i>
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

