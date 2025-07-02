
import React from "react";
import { Card, Button, Table } from "react-bootstrap";

function UserManagement() {
  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-center mb-4">
        <i className="bi bi-people-fill me-2"></i>
        Gestión de Usuarios
      </h2>
      <Card className="shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" className="rounded-3">
            <i className="bi bi-plus-lg me-2"></i>Agregar Usuario
          </Button>
        </div>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Juan Pérez</td>
              <td>juanperez@correo.com</td>
              <td>Docente</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button variant="danger" size="sm">
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Ana Gómez</td>
              <td>anagomez@correo.com</td>
              <td>Estudiante</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button variant="danger" size="sm">
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

export default UserManagement;
