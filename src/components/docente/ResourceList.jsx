
// src/components/docente/ResourceList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceItem from './ResourceItem';
import ResourceFilter from './ResourceFilter';

const ResourceList = ({ userId }) => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          'http://localhost:3000/api/docente/recursos',
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            }
          }
        );

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Formato de respuesta inválido');
        }

        setResources(response.data);
        
      } catch (err) {
        console.error('Error al cargar recursos:', {
          error: err,
          response: err.response
        });
        
        setError(err.response?.data?.message || 
                'Error al cargar los recursos. Intente recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [token, userId]);

  const handleDelete = async (resourceId) => {
    try {
      await axios.delete(`http://localhost:3000/api/docente/eliminar-recurso/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(resources.filter(res => res.id_recurso !== resourceId));
      setFilteredResources(filteredResources.filter(res => res.id_recurso !== resourceId));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleUpdate = (updatedResource) => {
    setResources(resources.map(res => 
      res.id_recurso === updatedResource.id_recurso ? updatedResource : res
    ));
    setFilteredResources(filteredResources.map(res => 
      res.id_recurso === updatedResource.id_recurso ? updatedResource : res
    ));
  };

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

  if (loading) return <div className="text-center my-5">Cargando recursos...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mt-4">
      <ResourceFilter 
        onFilter={handleFilter} 
        onReset={() => setFilteredResources(resources)} 
      />
      
      {filteredResources.length === 0 ? (
        <div className="alert alert-info">No se encontraron recursos</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {filteredResources.map(resource => (
            <div className="col" key={resource.id_recurso}>
              <ResourceItem 
                resource={resource} 
                onDelete={handleDelete} 
                onUpdate={handleUpdate} 
                editable={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceList;