
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    nombre: '',
    correo: '',
    rol: '',
    password: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    axios.get('http://localhost:3000/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUser({
        ...response.data,
        password: '' // No traemos la contraseña real
      });
    })
    .catch(error => {
      console.error('Error al cargar el perfil', error);
      navigate('/');
    });
  }, [token, navigate]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const showSection = (section) => {
    setActiveSection(section);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (isEditing) {
      axios.put('http://localhost:3000/api/profile', user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        alert('Perfil actualizado correctamente');
      })
      .catch(error => {
        console.error('Error al actualizar el perfil', error);
        alert('Error al actualizar perfil');
      });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <button className="btn btn-outline-primary me-3" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="ms-auto d-flex align-items-center position-relative">
          <div className="profile d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false" style={{ cursor: 'pointer' }}>
            <img src="https://i.pravatar.cc/150?img=3" alt="avatar" className="rounded-circle" width="40" height="40" />
            <span className="ms-2 fw-semibold">{user.nombre}</span>
          </div>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
          </ul>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className={`sidebar bg-dark ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ minWidth: '220px', maxWidth: '220px', transition: 'all 0.3s' }}>
          <h4 className="text-white text-center py-3">Menú</h4>
          <a href="#" onClick={() => showSection('welcome')} className="text-decoration-none d-block px-4 py-2 text-light">Inicio</a>
          <a href="#" onClick={() => showSection('profile')} className="text-decoration-none d-block px-4 py-2 text-light">Perfil</a>
          <a href="#" className="text-decoration-none d-block px-4 py-2 text-light">UTP+biblio</a>
          <a href="#" className="text-decoration-none d-block px-4 py-2 text-light">Ayuda</a>
        </div>

        {/* Main Content */}
        <div className={`content flex-grow-1 p-4 ${sidebarCollapsed ? 'full' : ''}`} style={{ transition: 'margin-left 0.3s' }}>
          {activeSection === 'welcome' && (
            <div className="text-center mt-5">
              <h1 className="mb-3">¡Bienvenido {user.rol}!</h1>
              <p className="text-muted">Nos alegra tenerte de vuelta.</p>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="container mt-5">
              <h2 className="mb-4 text-center">Perfil de Usuario</h2>
              <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" name="nombre" value={user.nombre} onChange={handleChange} readOnly={!isEditing} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo</label>
                      <input type="email" className="form-control" name="correo" value={user.correo} onChange={handleChange} readOnly={!isEditing} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña</label>
                      <input type="password" className="form-control" name="password" value={user.password} onChange={handleChange} placeholder="Nueva contraseña" readOnly={!isEditing} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rol</label>
                      <select className="form-select" name="rol" value={user.rol} onChange={handleChange} disabled={!isEditing}>
                        <option value="estudiante">Estudiante</option>
                        <option value="docente">Docente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="text-center">
                      <button type="button" className="btn btn-primary" onClick={handleEdit}>
                        {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sidebar.collapsed {
          margin-left: -220px;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
