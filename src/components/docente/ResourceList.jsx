
// src/components/docente/ResourceList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/ResourceTables.css';

const ResourceList = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterField, setFilterField] = useState('titulo');
  const [filterText, setFilterText] = useState('');
  const [filteredResources, setFilteredResources] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    titulo: '',
    descripcion: '',
    id_categoria: '',
    id_curso: ''
  });
  const token = localStorage.getItem('token');

  console.log('Cursos:', courses);
  console.log('Categorías:', categories);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [resourcesRes, datosUtilesRes] = await Promise.all([
          axios.get('http://localhost:3000/api/docente/recursos', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:3000/api/docente/datos-utiles', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setResources(resourcesRes.data);
        setCourses(datosUtilesRes.data.cursos);
        setCategories(datosUtilesRes.data.categorias);
        setFilteredResources(resourcesRes.data); // Mostrar todos al inicio
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const applyFilter = () => {
    const text = filterText.toLowerCase();
    const newFiltered = resources.filter(resource => {
      const fieldValue = (resource[filterField] ?? '').toString().toLowerCase();
      return fieldValue.includes(text);
    });
    setFilteredResources(newFiltered);
  };

  const handleDelete = (resourceId) => {
    confirmAlert({
      title: '¿Estás seguro?',
      message: 'Esta acción eliminará el recurso permanentemente.',
      buttons: [
        {
          label: 'Sí, eliminar',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:3000/api/docente/eliminar-recurso/${resourceId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              setResources(prev => prev.filter(resource => resource.id_recurso !== resourceId));
              setEditingId(null);
            } catch (err) {
              console.error('Error al editar recurso:', err);
              setError('No se pudo actualizar el recurso');
            }
          }
        },
        {
          label: 'Cancelar'
          // No se hace nada, solo cierra
        }
      ]
    });
  };

  const saveEdit = async (id) => {
    console.log('Datos a enviar:', {
      titulo: editForm.titulo,
      descripcion: editForm.descripcion,
      id_categoria: editForm.id_categoria,
      id_curso: editForm.id_curso
    });
    try {
      const response = await axios.put(
        `http://localhost:3000/api/docente/recurso/${id}`,
        {
          titulo: editForm.titulo,
          descripcion: editForm.descripcion,
          id_categoria: editForm.id_categoria,
          id_curso: editForm.id_curso
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Actualizar el estado con los datos devueltos por el backend
      setResources(resources.map(resource => 
        resource.id_recurso === id ? response.data.recurso : resource
      ));

      setEditingId(null);
    } catch (err) {
      console.error('Error al editar recurso:', err);
      setError(err.response?.data?.message || 'No se pudo actualizar el recurso');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const startEditing = (resource) => {
    setEditingId(resource.id_recurso);
    setEditForm({
      titulo: resource.titulo,
      descripcion: resource.descripcion,
      id_categoria: String(resource.id_categoria),
      id_curso: String(resource.id_curso)
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ titulo: '', descripcion: '', id_categoria: '', id_curso: '' });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4 mt-4">
      <h2 className="mb-4">
        <i className="bi bi-archive me-2"></i> 
        Mis Recursos
      </h2>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="titulo">Título</option>
            <option value="descripcion">Descripción</option>
            <option value="nombre_curso">Curso</option>
            <option value="nombre_categoria">Categoría</option>
            <option value="tipo_archivo">Tipo</option>
          </select>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={`Buscar por ${filterField}`}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-primary w-100"
            onClick={applyFilter}
          >
            Filtrar
          </button>
        </div>
      </div>
      
      {resources.length === 0 ? (
        <div className="alert alert-info">No has subido ningún recurso aún.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle mb-0">
            <thead className="table-dark d-md-table-header-group">
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Descripción</th>
                <th scope="col">Curso</th>
                <th scope="col">Categoría</th>
                <th scope="col">Tipo</th>
                <th scope="col">Fecha</th>
                <th scope="col">Acciones</th>
             </tr>
            </thead>
            <tbody>
              {filteredResources.map(resource => (
                <tr key={resource.id_recurso}>
                  <td data-label="Título:">
                    {editingId === resource.id_recurso ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="titulo"
                        value={editForm.titulo}
                        onChange={handleEditChange}
                      />
                    ) : (
                      <span className="d-md-inline">{resource.titulo}</span>
                    )}
                  </td>
                  <td data-label="Descripción:">
                    {editingId === resource.id_recurso ? (
                      <textarea
                        className="form-control form-control-sm"
                        name="descripcion"
                        value={editForm.descripcion}
                        onChange={handleEditChange}
                        rows="2"
                      />
                    ) : (
                      <span>{resource.descripcion || 'Sin descripción'}</span>
                    )}
                  </td>
                  <td data-label="Curso:">
                    {editingId === resource.id_recurso ? (
                      <select
                        className="form-select form-select-sm"
                        value={editForm.id_curso}
                        onChange={(e) => setEditForm({ ...editForm, id_curso: e.target.value })}
                      >
                        <option value="">-- Selecciona --</option>
                        {courses.map((curso) => (
                          <option key={curso.id_curso} value={curso.id_curso}>
                            {curso.nombre_curso}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{resource.nombre_curso}</span>
                    )}
                  </td>
                  <td data-label="Categoría:">
                    {editingId === resource.id_recurso ? (
                      <select
                        className="form-select form-select-sm"
                        value={editForm.id_categoria}
                        onChange={(e) => setEditForm({ ...editForm, id_categoria: e.target.value })}
                      >
                        <option value="">-- Selecciona --</option>
                        {categories.map((cat) => (
                          <option key={cat.id_categoria} value={cat.id_categoria}>
                            {cat.nombre_categoria}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{resource.nombre_categoria}</span>
                    )}
                  </td>
                  <td data-label="Tipo:">
                    <span className={`badge ${resource.tipo_archivo === 'PDF' ? 'bg-danger' : 'bg-primary'}`}>
                      {resource.tipo_archivo}
                    </span>
                  </td>
                  <td data-label="Fecha:">
                    <span className="text-nowrap">{formatDate(resource.fecha_subida)}</span>
                  </td>
                  <td data-label="Acciones:">
                    <div className="d-flex gap-1">
                      {editingId === resource.id_recurso ? (
                        <>
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => saveEdit(resource.id_recurso)}
                          >
                            <i className="bi bi-check"></i>
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEditing}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => startEditing(resource)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(resource.id_recurso)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
    </div>
  );
};

export default ResourceList;