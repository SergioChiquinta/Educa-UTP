
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
      // Actualizar datos del perfil
      axios.put('http://localhost:3000/api/profile', user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (selectedFile) {
          // Si también seleccionó imagen, la subimos
          const formData = new FormData();
          formData.append('profile_image', selectedFile);
  
          axios.put('http://localhost:3000/api/profile/picture', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            alert('Perfil y foto actualizados correctamente');
            setUser(prevUser => ({
              ...prevUser,
              foto_perfil: res.data.profileImage.split('/').pop() // Extrae solo el nombre del archivo
            }));
          })          
          .catch(error => {
            console.error('Error al actualizar la foto', error);
            alert('Error al actualizar la foto de perfil');
          });
        } else {
          alert('Perfil actualizado correctamente');
        }
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

  // Foto de perfil
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
          <img
            src={user.foto_perfil ? `http://localhost:3000/uploads/${user.foto_perfil}` : 'https://i.pravatar.cc/150?img=3'}
            alt="avatar"
            className="rounded-circle"
            width="40"
            height="40"
          />
            <span className="ms-2 fw-semibold">{user.nombre_rol}</span>
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
          <a href="https://tubiblioteca.utp.edu.pe" className="text-decoration-none d-block px-4 py-2 text-light">UTP+biblio</a>
          <a href="#" className="text-decoration-none d-block px-4 py-2 text-light">Ayuda</a>
        </div>

        {/* Main Content */}
        <div className={`content flex-grow-1 p-4 ${sidebarCollapsed ? 'full' : ''}`} style={{ transition: 'margin-left 0.3s' }}>
          {activeSection === 'welcome' && (
            <div className="text-center mt-5">
              <h1 className="mb-3">¡Bienvenido {user.nombre_rol}!</h1>
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
                      <label className="form-label">Foto de perfil</label>
                      <input type="file" className="form-control" onChange={handleFileChange} disabled={!isEditing} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" name="nombre" value={user.nombre_completo} onChange={handleChange} readOnly={!isEditing} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo</label>
                      <input type="email" className="form-control" name="correo" value={user.correo} onChange={handleChange} readOnly={!isEditing} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nueva contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="Escribe una nueva contraseña si deseas cambiarla"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rol (no editable)</label>
                      <input type="text" className="form-control" value={user.nombre_rol} readOnly />
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
