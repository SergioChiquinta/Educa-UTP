
// src/components/docente/ResourceList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ResourceList = ({ userId }) => {
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

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/docente/mis-recursos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResources(response.data);
      } catch (err) {
        console.error('Error al obtener recursos:', err);
        setError('Error al cargar los recursos');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [token, userId]);

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este recurso?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:3000/api/docente/recurso/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setResources(resources.filter(resource => resource.id_recurso !== id));
            } catch (err) {
              console.error('Error al eliminar recurso:', err);
              setError('No se pudo eliminar el recurso');
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const startEditing = (resource) => {
    setEditingId(resource.id_recurso);
    setEditForm({
      titulo: resource.titulo,
      descripcion: resource.descripcion,
      id_categoria: resource.id_categoria,
      id_curso: resource.id_curso
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/docente/recurso/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResources(resources.map(resource => 
        resource.id_recurso === id ? { 
          ...resource, 
          titulo: editForm.titulo,
          descripcion: editForm.descripcion,
          id_categoria: editForm.id_categoria,
          id_curso: editForm.id_curso,
          nombre_categoria: resources.find(r => r.id_categoria === editForm.id_categoria)?.nombre_categoria || resource.nombre_categoria,
          nombre_curso: resources.find(r => r.id_curso === editForm.id_curso)?.nombre_curso || resource.nombre_curso
        } : resource
      ));
      
      setEditingId(null);
    } catch (err) {
      console.error('Error al editar recurso:', err);
      setError('No se pudo actualizar el recurso');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) return <div className="text-center mt-4">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Recursos</h2>
      
      {resources.length === 0 ? (
        <div className="alert alert-info">No has subido ningún recurso aún.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Curso</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource.id_recurso}>
                  <td>
                    {editingId === resource.id_recurso ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="titulo"
                        value={editForm.titulo}
                        onChange={handleEditChange}
                      />
                    ) : (
                      resource.titulo
                    )}
                  </td>
                  <td>
                    {editingId === resource.id_recurso ? (
                      <textarea
                        className="form-control form-control-sm"
                        name="descripcion"
                        value={editForm.descripcion}
                        onChange={handleEditChange}
                        rows="2"
                      />
                    ) : (
                      resource.descripcion || 'Sin descripción'
                    )}
                  </td>
                  <td>
                    {editingId === resource.id_recurso ? (
                      <select
                        className="form-select form-select-sm"
                        name="id_curso"
                        value={editForm.id_curso}
                        onChange={handleEditChange}
                      >
                        {resources.map(r => (
                          <option key={r.id_curso} value={r.id_curso}>
                            {r.nombre_curso}
                          </option>
                        ))}
                      </select>
                    ) : (
                      resource.nombre_curso
                    )}
                  </td>
                  <td>
                    {editingId === resource.id_recurso ? (
                      <select
                        className="form-select form-select-sm"
                        name="id_categoria"
                        value={editForm.id_categoria}
                        onChange={handleEditChange}
                      >
                        {resources.map(r => (
                          <option key={r.id_categoria} value={r.id_categoria}>
                            {r.nombre_categoria}
                          </option>
                        ))}
                      </select>
                    ) : (
                      resource.nombre_categoria
                    )}
                  </td>
                  <td>{resource.tipo_archivo}</td>
                  <td>{formatDate(resource.fecha_subida)}</td>
                  <td>
                    {editingId === resource.id_recurso ? (
                      <>
                        <button 
                          className="btn btn-success btn-sm me-1"
                          onClick={() => saveEdit(resource.id_recurso)}
                        >
                          Guardar
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={cancelEditing}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn btn-primary btn-sm me-1"
                          onClick={() => startEditing(resource)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(resource.id_recurso)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
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