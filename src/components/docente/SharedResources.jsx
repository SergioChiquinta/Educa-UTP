
// src/components/docente/SharedResources.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./ResourceList.css";

const SharedResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:3000/api/docente/recursos-compartidos',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setResources(response.data);
      } catch (err) {
        console.error('Error:', err.response?.data || err.message);
        setError('Error al cargar los recursos');
        toast.error('Error al cargar los recursos');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePreview = (resource) => {
    const fileUrl = `http://localhost:3000/uploads/${resource.archivo_url}`;
    if (resource.tipo_archivo === 'PDF') {
      window.open(fileUrl, '_blank');
    } else {
      toast.info('Solo se pueden previsualizar archivos PDF');
    }
  };

  const handleDownload = async (resource) => {
    try {
      // 1. Registrar la descarga primero
      await axios.post(
        'http://localhost:3000/api/docente/registrar-descarga',
        { id_recurso: resource.id_recurso },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Iniciar la descarga
      const fileUrl = `http://localhost:3000/uploads/${resource.archivo_url}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${resource.titulo}.${resource.tipo_archivo.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Descarga iniciada');
    } catch (err) {
      console.error('Error al descargar:', err);
      toast.error('Error al registrar la descarga');
    }
  };

  if (loading) return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-2">Cargando recursos académicos...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger my-4">
      <i className="bi bi-exclamation-triangle me-2"></i>
      {error}
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="bi bi-file-earmark-arrow-down me-2"></i>
        Recursos Académicos
      </h2>
      
      {resources.length === 0 ? (
        <div className="alert alert-info">
          No hay recursos disponibles en este momento.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
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
                  <td data-label="Título">{resource.titulo}</td>
                  <td data-label="Descripción">{resource.descripcion || '-'}</td>
                  <td data-label="Curso">{resource.nombre_curso}</td>
                  <td data-label="Categoría">{resource.nombre_categoria}</td>
                  <td data-label="Tipo">
                    <span className={`badge ${
                      resource.tipo_archivo === 'PDF' ? 'bg-danger' : 'bg-primary'
                    }`}>
                      {resource.tipo_archivo}
                    </span>
                  </td>
                  <td data-label="Fecha">{formatDate(resource.fecha_subida)}</td>
                  <td data-label="Acciones">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handlePreview(resource)}
                        disabled={resource.tipo_archivo !== 'PDF'}
                        title="Previsualizar"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleDownload(resource)}
                        title="Descargar"
                      >
                        <i className="bi bi-download"></i>
                      </button>
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

export default SharedResources;