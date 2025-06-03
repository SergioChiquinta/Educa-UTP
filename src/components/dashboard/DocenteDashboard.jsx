
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ResourceList from '../docente/ResourceList';
import SharedResouces from '../docente/SharedResources';
import ResourceUpload from '../docente/ResourceUpload';

function Dashboard() {
  
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    nombre_completo: '',
    correo: '',
    nombre_rol: '',
    area_interes: '',
    foto_perfil: '',
    password: ''
  });

  // Función para manejar el éxito en la subida de recursos
  const handleUploadSuccess = (uploadedResource) => {
    // Actualizar la lista de recursos
    setResources(prev => [...prev, uploadedResource]);
    // Mostrar mensaje de éxito
    alert('Recurso subido correctamente');
    // Cambiar a la vista de recursos
    setActiveSection('resources');
  };

  // Función para manejar la eliminación de recursos
  const handleDeleteResource = (id) => {
    setResources(prev => prev.filter(resource => resource.id_recurso !== id));
  };

  // Función para manejar la actualización de recursos
  const handleUpdateResource = (updatedResource) => {
    setResources(prev => prev.map(resource => 
      resource.id_recurso === updatedResource.id_recurso ? updatedResource : resource
    ));
  };

  const token = localStorage.getItem('token');

  // Carga los cursos y categorías al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/docente/datos-utiles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(response.data.cursos);
        setCategories(response.data.categorias);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    
    if (token) loadInitialData();
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    
    const loadProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Extrae solo el nombre del archivo si hay una URL completa
        let foto_perfil = response.data.foto_perfil;
        if (foto_perfil && foto_perfil.includes('/')) {
          foto_perfil = foto_perfil.split('/').pop();
        }

        setUser({
          nombre_completo: response.data.nombre_completo,
          correo: response.data.correo,
          nombre_rol: response.data.nombre_rol,
          area_interes: response.data.area_interes || '',
          foto_perfil: foto_perfil || '',
          password: ''
        });

      } catch (error) {
        console.error('Error al cargar perfil:', error);
        navigate('/');
      }
    };

    loadProfile();
  }, [token, navigate]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const showSection = (section) => {
    setActiveSection(section);
    setIsEditing(false);
  };

  const handleEdit = async () => {
  if (isEditing) {
    try {
      // Primero actualizamos los datos del perfil
      await axios.put('http://localhost:3000/api/profile', {
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        password: user.password,
        area_interes: user.area_interes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Luego actualizamos la foto si hay una seleccionada
      if (selectedFile) {
        const formData = new FormData();
        formData.append('profile_image', selectedFile);

        const pictureResponse = await axios.put(
          'http://localhost:3000/api/profile/picture', 
          formData, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // Forzar una actualización completa del estado
        setUser(prev => ({
          ...prev,
          foto_perfil: pictureResponse.data.filename,
          password: '' // Limpiar contraseña
        }));
      }

      // Recargar los datos del servidor para asegurar consistencia
      const refreshed = await axios.get('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser({
        nombre_completo: refreshed.data.nombre_completo,
        correo: refreshed.data.correo,
        nombre_rol: refreshed.data.nombre_rol,
        area_interes: refreshed.data.area_interes || '',
        foto_perfil: refreshed.data.foto_perfil?.split('/').pop() || '',
        password: ''
      });

      alert(selectedFile ? 'Perfil y foto actualizados' : 'Perfil actualizado');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error al actualizar');
    }
  }
  setIsEditing(!isEditing);
};

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Foto de perfil
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validación básica del tipo de archivo
      if (!file.type.match('image.*')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      // Validación de tamaño (ejemplo: máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe exceder los 2MB');
        return;
      }
      setSelectedFile(file);
      
      // Vista previa inmediata (opcional)
      const reader = new FileReader();
      reader.onload = (event) => {
        setUser(prev => ({...prev, foto_perfil: event.target.result}));
      };
      reader.readAsDataURL(file);
    }
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
            src={
              user.foto_perfil
                ? `http://localhost:3000/uploads/${user.foto_perfil}?t=${Date.now()}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre_completo || 'U')}&background=random&rounded=true&size=40`
            }
            alt="avatar"
            className="rounded-circle"
            width="40"
            height="40"
          />
            <span className="ms-2 fw-semibold">{user.nombre_completo}</span>
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
          <a href="#" onClick={() => showSection('resources')} className="text-decoration-none d-block px-4 py-2 text-light">Mis recursos</a>
          <a href="#" onClick={() => showSection('upload')} className="text-decoration-none d-block px-4 py-2 text-light">Subir recursos</a>
          <a href="#" onClick={() => showSection('shared')} className="text-decoration-none d-block px-4 py-2 text-light">Recursos Compartidos</a>
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
                      <input type="text" className="form-control" name="nombre_completo" value={user.nombre_completo} onChange={handleChange} readOnly={!isEditing}/>
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
                    <div className="mb-3">
                      <label className="form-label">Área de interés</label>
                      <input type="text" className="form-control" name="area_interes" value={user.area_interes} onChange={handleChange} readOnly={!isEditing}/>
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
          
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {activeSection === 'upload' && (
              <ResourceUpload
                courses={courses} 
                categories={categories} 
                onUploadSuccess={handleUploadSuccess}
              />
            )}

            {activeSection === 'resources' && userId && (
              <ResourceList 
                userId={userId} 
                courses={courses} 
                categories={categories}
                onDelete={handleDeleteResource}
                onUpdate={handleUpdateResource}
              />
            )}

            {activeSection === 'shared' && userId && (
              <SharedResources userId={userId} />
            )}
          </main>
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
