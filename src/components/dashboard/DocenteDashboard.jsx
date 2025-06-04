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
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2">
        <button className="btn btn-outline-dark me-3" onClick={toggleSidebar}>☰</button>
        <div className="ms-auto d-flex align-items-center dropdown">
          <div
            className="d-flex align-items-center"
            data-bs-toggle="dropdown"
            style={{ cursor: 'pointer' }}
          >
            <img
              src={
                user.foto_perfil
                  ? `http://localhost:3000/uploads/${user.foto_perfil}?t=${Date.now()}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre_completo || 'U')}&background=random&rounded=true&size=40`
              }
              alt="avatar"
              className="rounded-circle border"
              width="40"
              height="40"
            />
            <span className="ms-2 fw-semibold text-dark">{user.nombre_completo}</span>
          </div>
          <ul className="dropdown-menu dropdown-menu-end mt-2">
            <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
          </ul>
        </div>
      </nav>
  
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className={`bg-dark text-white sidebar shadow-sm ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ minWidth: '220px', transition: 'all 0.3s' }}>
          <h5 className="text-center py-3 border-bottom border-secondary">📁 Menú</h5>
          <ul className="nav flex-column px-3">
            {[
              { label: '🏠 Inicio', section: 'welcome' },
              { label: '📚 Mis recursos', section: 'resources' },
              { label: '⬆️ Subir recursos', section: 'upload' },
              { label: '🔗 Recursos Compartidos', section: 'shared' },
              { label: '👤 Perfil', section: 'profile' },
            ].map(item => (
              <li key={item.section} className="nav-item my-1">
                <a
                  href="#"
                  onClick={() => showSection(item.section)}
                  className="nav-link text-white px-2"
                  style={{ transition: '0.2s', borderRadius: '5px' }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <hr className="border-secondary my-2" />
            <li className="nav-item px-0"><a href="https://tubiblioteca.utp.edu.pe" className="nav-link text-white">📖 UTP+biblio</a></li>
            <li className="nav-item px-0"><a href="#" className="nav-link text-white">❓ Ayuda</a></li>
          </ul>
        </div>
  
        {/* Main Content */}
        <div className="flex-grow-1 p-4 bg-light">
          {activeSection === 'welcome' && (
            <div className="text-center mt-5">
              <h2
                className="fw-bold text-center"
                style={{
                  color: '#1b1f3b',
                  fontSize: '2rem',
                  borderBottom: '3px solid #1b1f3b',
                  display: 'inline-block',
                  paddingBottom: '8px'
                }}
              >
                ¡Bienvenido, {user.nombre_rol}!
              </h2>
              <p className="text-muted mt-2">Nos alegra tenerte de vuelta.</p>
            </div>
          )}
  
          {activeSection === 'profile' && (
            <div className="container mt-5">
              <h2 className="mb-4 text-center fw-bold text-dark">👤 Perfil de Usuario</h2>
              <div className="card mx-auto shadow-sm rounded-4" style={{ maxWidth: '600px' }}>
                <div className="card-body">
                  <form>
                    {/* campos del perfil */}
                    <div className="mb-3">
                      <label className="form-label">Foto de perfil</label>
                      <input type="file" className="form-control" onChange={handleFileChange} disabled={!isEditing} />
                    </div>
                    {/* ...otros inputs... */}
                    <div className="text-center">
                      <button type="button" className="btn btn-dark px-4 py-2 rounded-3" onClick={handleEdit}>
                        {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
  
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
            <SharedResouces userId={userId} />
          )}
        </div>
      </div>
  
      {/* Estilo sidebar colapsado */}
      <style>{`
        .sidebar.collapsed {
          margin-left: -220px;
        }
        .sidebar {
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
  
}

export default Dashboard;
