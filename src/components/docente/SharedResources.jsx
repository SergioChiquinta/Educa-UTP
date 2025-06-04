
// src/components/docente/SharedResources.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SharedResources = ({ userId }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    curso: '',
    categoria: '',
    tipo: ''
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSharedResources = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener recursos compartidos
        const resResponse = await axios.get(
          'http://localhost:3000/api/docente/recursos-compartidos',
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            }
          }
        );

        if (!resResponse.data || !Array.isArray(resResponse.data)) {
          throw new Error('Formato de respuesta inválido para recursos compartidos');
        }

        setResources(resResponse.data);
        
      } catch (err) {
        console.error('Error al cargar recursos compartidos:', {
          error: err,
          response: err.response
        });
        
        setError(err.response?.data?.message || 
                'Error al cargar recursos compartidos. Intente recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredResources = resources.filter(resource => {
    return (
      (filters.curso === '' || resource.id_curso.toString() === filters.curso) &&
      (filters.categoria === '' || resource.id_categoria.toString() === filters.categoria) &&
      (filters.tipo === '' || resource.tipo_archivo === filters.tipo)
    );
  });

  const downloadResource = (filename) => {
    window.open(`http://localhost:3000/api/docente/descargar/${filename}`, '_blank');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener opciones únicas para los filtros
  const uniqueCourses = [...new Set(resources.map(r => r.id_curso))];
  const uniqueCategories = [...new Set(resources.map(r => r.id_categoria))];
  const uniqueTypes = [...new Set(resources.map(r => r.tipo_archivo))];

  if (loading) return <div className="text-center mt-4">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Recursos Compartidos por Otros Docentes</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filtros</h5>
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Curso</label>
              <select
                className="form-select"
                name="curso"
                value={filters.curso}
                onChange={handleFilterChange}
              >
                <option value="">Todos los cursos</option>
                {uniqueCourses.map(id => {
                  const course = resources.find(r => r.id_curso === id);
                  return course ? (
                    <option key={id} value={id}>{course.nombre_curso}</option>
                  ) : null;
                })}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
              >
                <option value="">Todas las categorías</option>
                {uniqueCategories.map(id => {
                  const category = resources.find(r => r.id_categoria === id);
                  return category ? (
                    <option key={id} value={id}>{category.nombre_categoria}</option>
                  ) : null;
                })}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Tipo de archivo</label>
              <select
                className="form-select"
                name="tipo"
                value={filters.tipo}
                onChange={handleFilterChange}
              >
                <option value="">Todos los tipos</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="alert alert-info">No se encontraron recursos con los filtros seleccionados.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Autor</th>
                <th>Curso</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map(resource => (
                <tr key={resource.id_recurso}>
                  <td>{resource.titulo}</td>
                  <td>{resource.descripcion || 'Sin descripción'}</td>
                  <td>{resource.autor}</td>
                  <td>{resource.nombre_curso}</td>
                  <td>{resource.nombre_categoria}</td>
                  <td>{resource.tipo_archivo}</td>
                  <td>{formatDate(resource.fecha_subida)}</td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => downloadResource(resource.archivo_url)}
                    >
                      Descargar
                    </button>
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