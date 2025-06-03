
// src/components/docente/ResourceItem.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResourceItem = ({ resource, onDelete, onUpdate, editable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: resource.titulo,
    description: resource.descripcion,
    courseId: resource.id_curso,
    categoryId: resource.id_categoria
  });
  const token = localStorage.getItem('token');

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/resources/${resource.id_recurso}`,
        {
          titulo: editData.title,
          descripcion: editData.description,
          id_curso: editData.courseId,
          id_categoria: editData.categoryId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      onUpdate(response.data);
      setIsEditing(false);
      toast.success('Recurso actualizado');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar');
    }
  };

  const handleDownload = () => {
    window.open(`http://localhost:3000/uploads/${resource.archivo_url}`, '_blank');
  };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
          />
        ) : (
          <h5 className="mb-0">{resource.titulo}</h5>
        )}
        {editable && (
          <div>
            {isEditing ? (
              <>
                <button className="btn btn-sm btn-success me-2" onClick={handleSave}>
                  Guardar
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-sm btn-primary me-2" 
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => onDelete(resource.id_recurso)}
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="card-body">
        {isEditing ? (
          <textarea
            className="form-control mb-3"
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            rows="3"
          />
        ) : (
          <p className="card-text">{resource.descripcion}</p>
        )}
        
        <div className="mb-2">
          <span className="badge bg-info me-2">
            {resource.nombre_curso || 'Sin curso'}
          </span>
          <span className="badge bg-warning">
            {resource.nombre_categoria || 'Sin categoría'}
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Subido el: {new Date(resource.fecha_subida).toLocaleDateString()}
          </small>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={handleDownload}
          >
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceItem;