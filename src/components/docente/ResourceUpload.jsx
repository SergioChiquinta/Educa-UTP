
// src/components/docente/ResourceUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResourceUpload = ({ courses, categories, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    courseId: '',
    categoryId: '',
    fileType: 'PDF'
  });

  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('archivo', formData.file);
      data.append('courseId', formData.courseId);
      data.append('categoryId', formData.categoryId);
      data.append('fileType', formData.fileType);

      const response = await axios.post(
        'http://localhost:3000/api/docente/subir-recurso',  // Ruta correcta
        data, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Recurso subido exitosamente');
      onUploadSuccess(response.data);
      setFormData({
        title: '',
        description: '',
        file: null,
        courseId: '',
        categoryId: '',
        fileType: 'PDF'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al subir el recurso');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card shadow-lg rounded-4 border-0 mb-4">
      <div className="card-header text-white rounded-top-4" style={{ backgroundColor: '#1b1f3b' }}>
        <h5 className="mb-0"><i className="bi bi-upload me-2"></i>Subir Nuevo Recurso</h5>
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold">Título</label>
            <input
              type="text"
              className="form-control shadow-sm"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Descripción</label>
            <textarea
              className="form-control shadow-sm"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Archivo</label>
            <input
              type="file"
              className="form-control shadow-sm"
              onChange={handleFileChange}
              accept=".pdf,.docx,.pptx"
              required
            />
            <small className="form-text text-muted">Formatos aceptados: PDF, DOCX, PPTX (Máx. 40MB)</small>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Curso</label>
              <select
                className="form-select shadow-sm"
                name="courseId"
                value={formData.courseId}
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
              <label className="form-label fw-semibold">Categoría</label>
              <select
                className="form-select shadow-sm"
                name="categoryId"
                value={formData.categoryId}
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
          <div className="mb-4">
            <label className="form-label fw-semibold">Tipo de Archivo</label>
            <select
              className="form-select shadow-sm"
              name="fileType"
              value={formData.fileType}
              onChange={handleChange}
              required
            >
              <option value="PDF">PDF</option>
              <option value="DOCX">Word (DOCX)</option>
              <option value="PPTX">PowerPoint (PPTX)</option>
            </select>
          </div>
          <div className="text-end">
          
          <button 
            type="submit" 
            className="btn text-white px-4 py-2 rounded-3"
            style={{ backgroundColor: '#1b1f3b' }}
            disabled={isUploading}
          >

              <i className="bi bi-cloud-arrow-up me-2"></i>
              {isUploading ? 'Subiendo...' : 'Subir Recurso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default ResourceUpload;