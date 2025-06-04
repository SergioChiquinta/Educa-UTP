
// src/components/docente/SharedResources.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceItem from './ResourceItem';
import ResourceFilter from './ResourceFilter';

const SharedResources = ({ userId }) => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
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

  const handleFilter = (filters) => {
    let result = resources;
    
    if (filters.courseId) {
      result = result.filter(res => res.id_curso == filters.courseId);
    }
    
    if (filters.categoryId) {
      result = result.filter(res => res.id_categoria == filters.categoryId);
    }
    
    if (filters.fileType) {
      result = result.filter(res => res.tipo_archivo === filters.fileType);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(res => 
        res.titulo.toLowerCase().includes(term) || 
        res.descripcion.toLowerCase().includes(term)
      );
    }
    
    setFilteredResources(result);
  };

  if (loading) return <div className="text-center my-5">Cargando recursos compartidos...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mt-4">
      <h4 className="mb-4">Recursos Compartidos por Otros Docentes</h4>
      
      <ResourceFilter 
        courses={courses}
        categories={categories}
        onFilter={handleFilter} 
        onReset={() => setFilteredResources(resources)} 
      />
      
      {filteredResources.length === 0 ? (
        <div className="alert alert-info">No se encontraron recursos compartidos</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {filteredResources.map(resource => (
            <div className="col" key={resource.id_recurso}>
              <ResourceItem 
                resource={resource} 
                editable={false} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedResources;