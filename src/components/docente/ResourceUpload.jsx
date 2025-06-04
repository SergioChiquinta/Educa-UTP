
// src/components/docente/ResourceUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResourceUpload = ({ courses, categories, onUploadSuccess }) => {
  

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    id_categoria: '',
    id_curso: '',
    tipo_archivo: 'PDF'
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validar tipo de archivo
      const fileType = selectedFile.name.split('.').pop().toUpperCase();
      if (!['PDF', 'DOCX', 'PPTX'].includes(fileType)) {
        setError('Solo se permiten archivos PDF, DOCX o PPTX');
        return;
      }
      setError('');
      setFile(selectedFile);
      setFormData(prev => ({ ...prev, tipo_archivo: fileType }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!file) {
      setError('Debes seleccionar un archivo');
      return;
    }

    if (!formData.id_categoria || !formData.id_curso) {
      setError('Debes seleccionar categoría y curso');
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('archivo', file);
      data.append('titulo', formData.titulo);
      data.append('descripcion', formData.descripcion);
      data.append('id_categoria', formData.id_categoria);
      data.append('id_curso', formData.id_curso);
      data.append('tipo_archivo', formData.tipo_archivo);

      const response = await axios.post(
        'http://localhost:3000/api/docente/subir-recurso',
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        onUploadSuccess(response.data);
        // Reset form
        setFormData({
          titulo: '',
          descripcion: '',
          id_categoria: '',
          id_curso: '',
          tipo_archivo: 'PDF'
        });
        setFile(null);
        document.getElementById('fileInput').value = '';
      }
    } catch (err) {
      console.error('Error al subir recurso:', err);
      setError(err.response?.data?.error || 'Error al subir el recurso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Subir Recurso Educativo</h2>
      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Título del Recurso</label>
              <input
                type="text"
                className="form-control"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Curso</label>
                <select
                  className="form-select"
                  name="id_curso"
                  value={formData.id_curso}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar curso</option>
                  {courses.map(curso => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.nombre_curso}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(categoria => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Archivo (PDF, DOCX, PPTX)</label>
              <input
                id="fileInput"
                type="file"
                className="form-control"
                onChange={handleFileChange}
                accept=".pdf,.docx,.pptx"
                required
              />
              {file && (
                <small className="text-muted">
                  Archivo seleccionado: {file.name} ({formData.tipo_archivo})
                </small>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Subiendo...' : 'Subir Recurso'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceUpload;