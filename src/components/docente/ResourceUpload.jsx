// src/components/docente/ResourceUpload.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ResourceUpload = ({ courses, categories, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    archivo: null,
    id_curso: "",
    id_categoria: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validación de tamaño (25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error("El archivo no debe exceder los 25MB");
        e.target.value = ""; // Limpiar el input
        return;
      }

      setFormData({ ...formData, archivo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación mejorada
    if (
      !formData.titulo.trim() ||
      !formData.id_curso ||
      !formData.id_categoria ||
      !formData.archivo
    ) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    setIsUploading(true);

    try {
      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("descripcion", formData.descripcion || ""); // Asegurar campo
      data.append("archivo", formData.archivo);
      data.append("id_curso", formData.id_curso);
      data.append("id_categoria", formData.id_categoria);

      // Añadir logs para depuración
      console.log("Enviando FormData con:", {
        titulo: formData.titulo,
        curso: formData.id_curso,
        categoria: formData.id_categoria,
        archivo: formData.archivo.name,
      });

      const response = await axios.post(
        "http://localhost:3000/api/docente/subir-recurso",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 segundos timeout
        }
      );

      toast.success("Recurso subido exitosamente");
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      // Reset mejorado
      setFormData({
        titulo: "",
        descripcion: "",
        archivo: null,
        id_curso: "",
        id_categoria: "",
      });
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error("Error completo:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
        stack: error.stack,
      });

      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al subir el recurso";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2
        className="text-center fw-bold mb-4"
        style={{
          color: "#1B1F3B",
          fontSize: "2rem",
          borderBottom: "3px solid #1B1F3B",
          display: "inline-flex",
          alignItems: "center",
          paddingBottom: "8px",
          marginLeft: "430px",
          gap: "10px",
        }}
      >
        <i
          className="bi bi-book"
          style={{ color: "#0D6EFD", fontSize: "1.6rem" }}
        ></i>
        Subir Recurso Educativo
      </h2>
      <div
        className="card shadow rounded-4 border-0"
        style={{ backgroundColor: "#F9F9FC" }}
      >
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej. Introducción a la Física"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Agrega una descripción clara del recurso"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Archivo *</label>
              <input
                id="fileInput"
                type="file"
                className="form-control"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                required
              />
              <small className="text-muted">
                Formatos aceptados: PDF, DOCX (Máx. 25MB)
              </small>
            </div>
            {/* Vista previa del archivo */}
            {formData.archivo && (
              <div className="table-responsive mb-4">
                <table className="table table-bordered text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Tamaño</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{formData.archivo.name}</td>
                      <td>
                        {(formData.archivo.size / 1024 / 1024).toFixed(2)} MB
                      </td>
                      <td>{formData.archivo.type}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Curso *</label>
                <select
                  name="id_curso"
                  value={formData.id_curso}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar curso</option>
                  {courses.map((course) => (
                    <option key={course.id_curso} value={course.id_curso}>
                      {course.nombre_curso}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Categoría *</label>
                <select
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option
                      key={category.id_categoria}
                      value={category.id_categoria}
                    >
                      {category.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-dark px-4"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Subiendo...
                  </>
                ) : (
                  "Subir Recurso"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceUpload;
