
// src/components/docente/SharedResources.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import { renderAsync } from 'docx-preview';
import { Document, Page, pdfjs } from 'react-pdf';
import '../../styles/ResourceTables.css';
import '../../styles/ResourceModalPreview.css';

// Importar el worker desde pdfjs-dist directamente
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfPages, setPdfPages] = useState(null);
  const [currentPDFResource, setCurrentPDFResource] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/general/recursos-compartidos`,
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
    try {
      console.log('Intentando previsualizar recurso:', resource);
      console.log('URL del archivo:', resource.archivo_url);
      console.log('Tipo de archivo:', resource.tipo_archivo);
      if (resource.tipo_archivo === 'PDF') {
        setCurrentPDFResource(resource);
        setPdfUrl(resource.archivo_url);
        setShowPDFModal(true);

      } else if (resource.tipo_archivo === 'DOCX') {
        setCurrentWordResource(resource);
        setShowWordModal(true);

        await new Promise(resolve => setTimeout(resolve, 100));

        const response = await axios.get(resource.archivo_url, {
          responseType: 'arraybuffer',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        previewContainerRef.current.innerHTML = '';

        await renderAsync(
          response.data,
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
      }
    } catch (error) {
      console.error('Error al previsualizar:', error);
      console.error('Detalles del error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      toast.error(`Error al obtener el ${resource.tipo_archivo}`);
      toast.error(`Error al obtener el ${resource.tipo_archivo}: ${error.message}`);
    }
  };

  const handleDownload = async (resource) => {
    try {
      // Registrar la descarga en el backend
      await axios.post(
        `${process.env.REACT_APP_API_URL}/general/registrar-descarga`,
        { id_recurso: resource.id_recurso },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Manejo especial para PDFs
      if (resource.tipo_archivo === 'PDF') {
        // Usar axios para obtener el blob con el token de autorización
        const response = await axios.get(resource.archivo_url, {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        });

        // Crear URL del blob
        const url = window.URL.createObjectURL(new Blob([response.data], {
          type: response.headers['content-type']
        }));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${resource.titulo}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // Manejo normal para DOCX y otros tipos
        const link = document.createElement('a');
        link.href = resource.archivo_url;
        link.setAttribute('download', `${resource.titulo}.${resource.tipo_archivo.toLowerCase()}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success('Descarga iniciada');
    } catch (err) {
      console.error('Error al descargar:', {
        error: err,
        response: err.response,
        message: err.message
      });
      toast.error(`Error al descargar el recurso: ${err.message}`);
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
                  <td data-label="Título:">{resource.titulo}</td>
                  <td data-label="Descripción:">{resource.descripcion || '-'}</td>
                  <td data-label="Curso:">{resource.nombre_curso}</td>
                  <td data-label="Categoría:">{resource.nombre_categoria}</td>
                  <td data-label="Tipo:">
                    <span className={`badge ${
                      resource.tipo_archivo === 'PDF' ? 'bg-danger' : 'bg-primary'
                    }`}>
                      {resource.tipo_archivo}
                    </span>
                  </td>
                  <td data-label="Fecha:">{formatDate(resource.fecha_subida)}</td>
                  <td data-label="Acciones:">
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

      {/* Modal para previsualización de PDF */}
      <Modal show={showPDFModal} onHide={() => setShowPDFModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-earmark-pdf me-2"></i>
            {currentPDFResource?.titulo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '70vh', overflow: 'auto' }}>
          {pdfUrl ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => setPdfPages(numPages)}
              onLoadError={(err) => {
                console.error('Error al cargar el PDF:', err);
                toast.error('Error al cargar el PDF');
              }}
            >
              {Array.from(new Array(pdfPages), (_, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          ) : (
            <p>Cargando documento PDF...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => {
              if (currentPDFResource) {
                handleDownload(currentPDFResource);
              }
            }}
          >
            <i className="bi bi-download me-2"></i> Descargar
          </Button>
          <Button variant="secondary" onClick={() => setShowPDFModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default SharedResources;
