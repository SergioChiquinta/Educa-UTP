
// src/components/docente/ResourceUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResourceUpload = ({ courses, categories, onUploadSuccess }) => {
  

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    archivo: null,
    id_curso: '',
    id_categoria: ''
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validación de tamaño (25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error('El archivo no debe exceder los 25MB');
        e.target.value = ''; // Limpiar el input
        return;
      }
      
      setFormData({ ...formData, archivo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación mejorada
    if (!formData.titulo.trim() || !formData.id_curso || !formData.id_categoria || !formData.archivo) {
      toast.error('Complete todos los campos obligatorios');
      return;
    }

    setIsUploading(true);

    try {
      const data = new FormData();
      data.append('titulo', formData.titulo);
      data.append('descripcion', formData.descripcion || ''); // Asegurar campo
      data.append('archivo', formData.archivo);
      data.append('id_curso', formData.id_curso);
      data.append('id_categoria', formData.id_categoria);

      // Añadir logs para depuración
      console.log('Enviando FormData con:', {
        titulo: formData.titulo,
        curso: formData.id_curso,
        categoria: formData.id_categoria,
        archivo: formData.archivo.name
      });

      const response = await axios.post(
        'http://localhost:3000/api/docente/subir-recurso',
        data,
        'http://localhost:3000/api/docente/subir-recurso',
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 segundos timeout
        }
      );

      toast.success('Recurso subido exitosamente');
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
      
      // Reset mejorado
      setFormData({
        titulo: '',
        descripcion: '',
        archivo: null,
        id_curso: '',
        id_categoria: ''
      });
      document.getElementById('fileInput').value = '';
      
    } catch (error) {
      console.error('Error completo:', {
        message: error.message,
        response: error.response?.data,
        config: error.config,
        stack: error.stack
      });
      
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Error al subir el recurso';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5>Subir Nuevo Recurso</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Título *</label>
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
          <div className="mb-3">
            <label className="form-label">Archivo *</label>
            <input
              id="fileInput"
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept=".pdf,.docx"
              required
            />
            <small className="text-muted">Formatos aceptados: PDF, DOCX (Máx. 25MB)</small>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Curso *</label>
              <select
                className="form-select"
                name="id_curso"
                value={formData.id_curso}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar curso</option>
                {courses.map(course => (
                  <option key={course.id_curso} value={course.id_curso}>
                    {course.nombre_curso}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Categoría *</label>
              <select
                className="form-select"
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.id_categoria} value={category.id_categoria}>
                    {category.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Subiendo...
              </>
            ) : 'Subir Recurso'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResourceUpload;
