
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Modal, Form } from "react-bootstrap";
import '../../styles/ResourceTables.css';

function UserManagement() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosOriginales, setUsuariosOriginales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre_completo: "",
    correo: "",
    contrasena: "",
    id_rol: 3, // Por defecto estudiante
    area_interes: ""
  });
  const [campoFiltro, setCampoFiltro] = useState("nombre_completo");
  const [valorFiltro, setValorFiltro] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/usuarios`);
      setUsuarios(res.data);
      setUsuariosOriginales(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleShowModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        contrasena: "",
        id_rol: user.id_rol,
        area_interes: user.area_interes || ""
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre_completo: "",
        correo: "",
        contrasena: "",
        id_rol: 3,
        area_interes: ""
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const correoValido = /^[a-zA-Z0-9._%+-]+@utp\.edu\.pe$/.test(formData.correo);
      if (!correoValido) {
        alert("El correo debe ser válido y terminar en @utp.edu.pe");
        return;
      }

      if (editingUser) {
        // Editar
        await axios.put(`${process.env.REACT_APP_API_URL}/usuarios/${editingUser.id_usuario}`, formData);
      } else {
        // Crear
        await axios.post(`${process.env.REACT_APP_API_URL}/usuarios`, formData);
      }
      fetchUsuarios();
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/usuarios/${id}`);
        fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleFilter = () => {
    const filtered = usuariosOriginales.filter(user => {
      const campo = (user[campoFiltro] || "").toLowerCase();
      return campo.includes(valorFiltro.toLowerCase());
    });
    setUsuarios(filtered);
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-center mb-4">
        <i className="bi bi-people-fill me-2"></i>
        Gestión de Usuarios
      </h2>
      <Card className="shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between mb-3 gap-2 flex-wrap">
          <div className="d-flex gap-2 flex-grow-1">
            <Form.Select value={campoFiltro} onChange={e => setCampoFiltro(e.target.value)}>
              <option value="nombre_completo">Nombre</option>
              <option value="correo">Correo</option>
              <option value="area_interes">Área de Interés</option>
              <option value="nombre_rol">Rol</option>
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="Escribe para filtrar..."
              value={valorFiltro}
              onChange={e => setValorFiltro(e.target.value)}
            />
            <Button variant="secondary" onClick={handleFilter}>Filtrar</Button>
          </div>
          <Button variant="primary" className="rounded-3" onClick={() => handleShowModal()}>
            <i className="bi bi-plus-lg me-2"></i>Agregar Usuario
          </Button>
        </div>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Nº</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Área de Interés</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user, index) => (
              <tr key={user.id_usuario}>
                <td data-label="Nº:">{index + 1}</td>
                <td data-label="Nombre:">{user.nombre_completo}</td>
                <td data-label="Correo:">{user.correo}</td>
                <td data-label="Área de Interés:">{user.area_interes}</td>
                <td data-label="Rol:">{user.nombre_rol}</td>
                <td data-label="Acciones:">
                  <div className="d-flex gap-2">
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(user)}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(user.id_usuario)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
              />
            </Form.Group>
            {!editingUser && (
              <Form.Group>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label>Área de Interés</Form.Label>
              <Form.Control
                type="text"
                name="area_interes"
                value={formData.area_interes}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="id_rol"
                value={formData.id_rol}
                onChange={handleChange}
              >
                <option value={1}>Administrador</option>
                <option value={2}>Docente</option>
                <option value={3}>Estudiante</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserManagement;
