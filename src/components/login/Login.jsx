import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../styles/Login.css'; // Aquí meteremos tus estilos en archivo aparte

function Login() {
  return (
    <div className="card d-flex flex-column flex-md-row">
      {/* Left side with illustration */}
      <div className="left-side col-md-6 pe-md-6">
        <img
          src="https://storage.googleapis.com/a1aa/image/5f0f709a-7471-4f10-e38e-6ecb1b78baa7.jpg"
          alt="Ilustración educativa"
          className="img-fluid"
          style={{ maxWidth: '600px' }}
          width="600"
          height="400"
        />
      </div>

      {/* Right side with login form */}
      <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
        {/* Logo UTP */}
        <div className="mb-4 d-flex align-items-center">
          <div className="d-flex gap-1">
            {['E', 'D', 'U', 'C', 'A'].map((letter, index) => (
              <div key={index} className="logo-box">{letter}</div>
            ))}
          </div>
          <div className="ms-2 d-flex align-items-center fs-3 fw-bold">
            UTP
          </div>
        </div>

        {/* Title and subtitle */}
        <h2 className="fw-semibold mb-1" style={{ fontSize: '1.25rem' }}>
          Plataforma dinámica para administrar recursos educativos.
        </h2>
        <p className="text-secondary fs-5 mb-4">
          Experiencia digital ágil en gestión académica.
        </p>

        {/* Introductory text */}
        <p className="mb-3" style={{ fontSize: '0.9rem' }}>
          Ingresa tus datos para <strong>iniciar sesión.</strong>
        </p>

        {/* Login form */}
        <form autoComplete="off" noValidate>
          {/* Email field */}
          <div className="mb-3 position-relative">
            <label htmlFor="codigo-utp" className="form-label fw-semibold">Email</label>
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
            <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
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
      </div>
    </div>
  );
}

export default Login;
