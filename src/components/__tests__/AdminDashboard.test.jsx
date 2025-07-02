
// __tests__/AdminDashboard.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../dashboard/AdminDashboard";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// Mock axios
jest.mock("axios");

// Mock componentes hijos
jest.mock("../admin-gestion-usuarios/UserManagement", () => () => <div>Mock UserManagement</div>);
jest.mock("../docente/SharedResources", () => () => <div>Mock SharedResources</div>);
jest.mock("../dashboard/LandbotWidget", () => () => <div data-testid="landbot">LandbotWidget</div>);

const mockProfileData = {
  nombre_completo: "Admin User",
  correo: "admin@example.com",
  nombre_rol: "Administrador",
  area_interes: "Tecnología",
  foto_perfil: "",
};

const mockEstadisticas = {
  usuariosRegistrados: 10,
  recursosSubidos: 5,
  descargasHechas: 20,
};

// Mock global para alert
beforeAll(() => {
  global.alert = jest.fn();
});

describe("Dashboard (Admin)", () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return "fake-token";
      return null;
    });

    axios.get.mockImplementation((url) => {
      if (url.includes("/api/profile")) {
        return Promise.resolve({ data: mockProfileData });
      }
      if (url.includes("/api/general/estadisticas")) {
        return Promise.resolve({ data: mockEstadisticas });
      }
      return Promise.resolve({ data: {} });
    });

    axios.put.mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it("renderiza correctamente la sección welcome por defecto", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("¡Bienvenido, Administrador!")).toBeInTheDocument();
    });

    expect(screen.getByText("Usuarios Registrados")).toBeInTheDocument();
    expect(await screen.findByText("10")).toBeInTheDocument();
    expect(screen.getByText("Descargas Realizadas")).toBeInTheDocument();
    expect(await screen.findByText("20")).toBeInTheDocument();
  });

  it("permite cambiar a sección de perfil y editar datos", async () => {
    renderComponent();

    await screen.findByText("¡Bienvenido, Administrador!");

    const perfilLink = screen.getByText("Perfil");
    fireEvent.click(perfilLink);

    expect(await screen.findByText("Perfil de Usuario")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Admin User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("admin@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Administrador")).toBeInTheDocument();

    const editButton = screen.getByText("Editar Perfil");
    fireEvent.click(editButton);

    const nombreInput = screen.getByDisplayValue("Admin User");
    fireEvent.change(nombreInput, { target: { value: "Nuevo Nombre" } });
    expect(nombreInput.value).toBe("Nuevo Nombre");

    const saveButton = screen.getByText("Guardar Cambios");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:3000/api/profile",
        expect.any(Object),
        expect.any(Object)
      );
    });

    expect(global.alert).toHaveBeenCalled();
  });

  it("carga sección de gestión de usuarios", async () => {
    renderComponent();
    await screen.findByText("¡Bienvenido, Administrador!");

    const userMgmtLink = screen.getByText("Gestión de Usuarios");
    fireEvent.click(userMgmtLink);

    expect(await screen.findByText("Mock UserManagement")).toBeInTheDocument();
  });

  it("carga sección de recursos compartidos", async () => {
    renderComponent();
    await screen.findByText("¡Bienvenido, Administrador!");

    const sharedLink = screen.getByText("Recursos Compartidos");
    fireEvent.click(sharedLink);

    expect(await screen.findByText("Mock SharedResources")).toBeInTheDocument();
  });

  it("permite colapsar el sidebar", async () => {
    renderComponent();
    await screen.findByText("¡Bienvenido, Administrador!");

    const toggleButton = screen.getByText("☰");
    fireEvent.click(toggleButton);

    // Si quisieras verificar clases, puedes hacerlo aquí
  });

  it("permite cerrar sesión", async () => {
    renderComponent();
    await screen.findByText("¡Bienvenido, Administrador!");

    const avatar = screen.getByRole("img");
    fireEvent.click(avatar.parentElement);

    const logoutButton = screen.getByText("Cerrar sesión");
    expect(logoutButton).toBeInTheDocument();
  });
});
