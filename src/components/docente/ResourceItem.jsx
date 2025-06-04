
// src/components/docente/ResourceItem.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResourceItem = ({ resource, onDelete, onUpdate, editable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    titulo: resource.titulo,
    descripcion: resource.descripcion
  });
  const token = localStorage.getItem('token');

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/docente/recurso/${resource.id_recurso}`,
        editedData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success('Recurso actualizado');
      if (onUpdate) onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      toast.error('Error al actualizar el recurso');
      console.error(error);
    }
  };

  const handleDownload = () => {
    window.open(`http://localhost:3000/uploads/recursos/${resource.archivo_url}`, '_blank');
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este recurso?')) {
      try {
        await axios.delete(
          `http://localhost:3000/api/docente/eliminar-recurso/${resource.id_recurso}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success('Recurso eliminado');
        if (onDelete) onDelete(resource.id_recurso);
      } catch (error) {
        toast.error('Error al eliminar el recurso');
        console.error(error);
      }
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        {isEditing ? (
          <>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="titulo"
                value={editedData.titulo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                name="descripcion"
                value={editedData.descripcion}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </>
        ) : (
          <>
            <h5 className="card-title">{resource.titulo}</h5>
            <p className="card-text">{resource.descripcion}</p>
            <p className="text-muted small">
              <strong>Curso:</strong> {resource.nombre_curso}<br />
              <strong>Categoría:</strong> {resource.nombre_categoria}<br />
              <strong>Tipo:</strong> {resource.tipo_archivo}<br />
              <strong>Subido:</strong> {new Date(resource.fecha_subida).toLocaleDateString()}
            </p>
          </>
        )}
      </div>
      <div className="card-footer bg-transparent">
        <button 
          className="btn btn-sm btn-outline-primary me-2"
          onClick={handleDownload}
        >
          Descargar
        </button>
        
        {editable && (
          <>
            {isEditing ? (
              <>
                <button 
                  className="btn btn-sm btn-success me-2"
                  onClick={handleSave}
                >
                  Guardar
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-sm btn-outline-warning me-2"
                  onClick={handleEdit}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResourceItem;
