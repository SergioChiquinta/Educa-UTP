
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
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5>Subir Nuevo Recurso</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Archivo</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept=".pdf,.docx,.pptx"
              required
            />
            <small className="text-muted">Formatos aceptados: PDF, DOCX, PPTX (Máx. 40MB)</small>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Curso</label>
              <select
                className="form-select"
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
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
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
          <div className="mb-3">
            <label className="form-label">Tipo de Archivo</label>
            <select
              className="form-select"
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
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isUploading}
          >
            {isUploading ? 'Subiendo...' : 'Subir Recurso'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResourceUpload;