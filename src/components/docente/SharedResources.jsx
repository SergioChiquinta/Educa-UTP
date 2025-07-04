
// src/components/docente/SharedResources.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { renderAsync } from 'docx-preview';
import '../../styles/ResourceTables.css';
import '../../styles/ResourceModalPreview.css';

const SharedResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWordModal, setShowWordModal] = useState(false);
  const [currentWordResource, setCurrentWordResource] = useState(null);
  const [filterField, setFilterField] = useState('titulo');
  const [filterText, setFilterText] = useState('');
  const [filteredResources, setFilteredResources] = useState([]);
  const previewContainerRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:3000/api/general/recursos-compartidos',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setResources(response.data);
        setFilteredResources(response.data); // Mostrar todos al inicio
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

  const applyFilter = () => {
    const text = filterText.toLowerCase();
    const newFiltered = resources.filter(resource => {
      const fieldValue = (resource[filterField] ?? '').toString().toLowerCase();
      return fieldValue.includes(text);
    });
    setFilteredResources(newFiltered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePreview = async (resource) => {
    if (resource.tipo_archivo === 'PDF') {
      window.open(`http://localhost:3000/uploads/${resource.archivo_url}`, '_blank');
    } else if (resource.tipo_archivo === 'DOCX') {
      try {
        setCurrentWordResource(resource);
        setShowWordModal(true);

        await new Promise(resolve => setTimeout(resolve, 100));

        const response = await fetch(`http://localhost:3000/uploads/${resource.archivo_url}`);
        const arrayBuffer = await response.arrayBuffer();

        previewContainerRef.current.innerHTML = '';

        await renderAsync(
          arrayBuffer,
          previewContainerRef.current,
          null,
          {
            className: 'docx-preview',
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: false,
            breakPages: true,
            debug: false
          }
        );
      } catch (error) {
        console.error('Error al previsualizar DOCX:', error);
        toast.error('Error al cargar la previsualización');
        setShowWordModal(false);
      }
    }
  };

  const handleDownload = async (resource) => {
    try {
      await axios.post(
        'http://localhost:3000/api/general/registrar-descarga',
        { id_recurso: resource.id_recurso },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fileUrl = `http://localhost:3000/uploads/${resource.archivo_url}?download=true`;
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
              {filteredResources.map(resource => (
                <tr key={resource.id_recurso}>
                  <td>{resource.titulo}</td>
                  <td>{resource.descripcion || '-'}</td>
                  <td>{resource.nombre_curso}</td>
                  <td>{resource.nombre_categoria}</td>
                  <td>
                    <span className={`badge ${
                      resource.tipo_archivo === 'PDF' ? 'bg-danger' : 'bg-primary'
                    }`}>
                      {resource.tipo_archivo}
                    </span>
                  </td>
                  <td>{formatDate(resource.fecha_subida)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handlePreview(resource)}
                        disabled={!['PDF', 'DOCX'].includes(resource.tipo_archivo)}
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

      {/* Modal para previsualización de Word */}
      <Modal show={showWordModal} onHide={() => setShowWordModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title data-testid="modal-title">
            <i className="bi bi-file-earmark-word me-2"></i>
            {currentWordResource?.titulo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '70vh', overflow: 'auto' }}>
          <div ref={previewContainerRef} className="docx-container" />
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={() => {
              if (currentWordResource) {
                handleDownload(currentWordResource);
              }
            }}
          >
            <i className="bi bi-download me-2"></i>
            Descargar
          </Button>
          <Button variant="secondary" onClick={() => setShowWordModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SharedResources;
