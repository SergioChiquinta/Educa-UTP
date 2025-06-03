
// src/components/docente/ResourceFilter.jsx
import React, { useState } from 'react';

const ResourceFilter = ({ onFilter, onReset, courses = [], categories = [] }) => {
  const [filters, setFilters] = useState({
    courseId: '',
    categoryId: '',
    fileType: '',
    searchTerm: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      courseId: '',
      categoryId: '',
      fileType: '',
      searchTerm: ''
    });
    onReset();
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <h5 className="mb-0">Filtrar Recursos</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Curso</label>
              <select
                className="form-select"
                name="courseId"
                value={filters.courseId}
                onChange={handleChange}
              >
                <option value="">Todos los cursos</option>
                {courses.map(course => (
                  <option key={course.id_curso} value={course.id_curso}>
                    {course.nombre_curso}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                name="categoryId"
                value={filters.categoryId}
                onChange={handleChange}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id_categoria} value={category.id_categoria}>
                    {category.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Tipo</label>
              <select
                className="form-select"
                name="fileType"
                value={filters.fileType}
                onChange={handleChange}
              >
                <option value="">Todos</option>
                <option value="PDF">PDF</option>
                <option value="DOCX">Word</option>
                <option value="PPTX">PowerPoint</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Buscar</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar recursos..."
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleChange}
                />
                <button className="btn btn-primary" type="submit">
                  Filtrar
                </button>
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={handleReset}
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFilter;