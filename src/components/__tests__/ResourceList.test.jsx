
// __tests__/ResourceList.test.jsx

jest.mock('axios');
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResourceList from '../docente/ResourceList';
import axios from 'axios';

describe('ResourceList', () => {
  beforeEach(() => {
    // Reinicia mocks antes de cada prueba
    axios.get.mockReset();
    axios.delete.mockReset();
    axios.put.mockReset();
  });

  it('muestra mensaje de carga al inicio', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: { cursos: [], categorias: [] } });

    render(<ResourceList />);

    expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  it('muestra mensaje si no hay recursos', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // recursos
    axios.get.mockResolvedValueOnce({ data: { cursos: [], categorias: [] } }); // cursos y categorias

    render(<ResourceList />);

    await waitFor(() => {
      expect(screen.getByText(/No has subido ningún recurso aún./i)).toBeInTheDocument();
    });
  });

  it('renderiza filtros correctamente', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: { cursos: [], categorias: [] } });

    render(<ResourceList />);

    await waitFor(() => {
      expect(screen.getByText(/Filtrar/i)).toBeInTheDocument();
    });

    const filtroInput = screen.getByPlaceholderText(/Buscar por/i);
    expect(filtroInput).toBeInTheDocument();

    fireEvent.change(filtroInput, { target: { value: 'test' } });
    expect(filtroInput.value).toBe('test');
  });

  it('renderiza tabla si hay recursos', async () => {
    const mockResources = [
        {
        id_recurso: 1,
        titulo: 'Recurso 1',
        descripcion: 'Descripción 1',
        nombre_curso: 'Curso 1',
        nombre_categoria: 'Categoría 1',
        tipo_archivo: 'PDF',
        fecha_subida: '2024-06-28T00:00:00.000Z',
        id_categoria: 1,
        id_curso: 1,
        }
    ];

    axios.get.mockResolvedValueOnce({ data: mockResources });
    axios.get.mockResolvedValueOnce({ data: { cursos: [], categorias: [] } });

    render(<ResourceList />);

    await waitFor(() => {
        expect(screen.getByText(/Recurso 1/i)).toBeInTheDocument();
        const cursoElements = screen.getAllByText(/Curso 1/i);
        expect(cursoElements.length).toBeGreaterThan(0);
    });
    });

});
