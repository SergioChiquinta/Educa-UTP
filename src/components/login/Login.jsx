
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../styles/Login.css';

import LeftIllustration from './LeftIllustration';
import LogoEduca from './LogoEduca';
import FormLogin from './FormLogin';

function Login() {
  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="login-card d-flex flex-column flex-md-row overflow-hidden shadow rounded-3 bg-white">
        {/* Left Side */}
        <LeftIllustration />

        {/* Right Side */}
        <div className="login-form d-flex flex-column justify-content-center p-5">
          <LogoEduca />

          <h2 className="fw-semibold mb-1 fs-5">
            Plataforma dinámica para administrar recursos educativos.
          </h2>
          <p className="text-secondary fs-6 mb-4">
            Experiencia digital ágil en gestión académica.
          </p>

          <p className="mb-3" style={{ fontSize: '0.9rem' }}>
            Ingresa tus datos para <strong>iniciar sesión.</strong>
          </p>

          <FormLogin />
        </div>
      </div>
    </div>
  );
}

export default Login;
