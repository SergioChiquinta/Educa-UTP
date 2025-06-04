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
      data.append("descripcion", formData.descripcion || "");
      data.append("archivo", formData.archivo);
      data.append("id_curso", formData.id_curso);
      data.append("id_categoria", formData.id_categoria);

      const response = await axios.post(
        "http://localhost:3000/api/docente/subir-recurso",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      toast.success("Recurso subido exitosamente");
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      setFormData({
        titulo: "",
        descripcion: "",
        archivo: null,
        id_curso: "",
        id_categoria: "",
      });
      document.getElementById("fileInput").value = "";
    } catch (error) {
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
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="bi bi-cloud-arrow-up-fill me-2 text-primary"></i>
        Subir Recurso Académico
      </h2>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-card-heading me-2"></i>
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Ej: Introducción a la Física Cuántica"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-text-paragraph me-2"></i>
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Describe el contenido del recurso..."
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <i className="bi bi-book me-2"></i>
                  Curso *
                </label>
                <select
                  name="id_curso"
                  value={formData.id_curso}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccione un curso</option>
                  {courses.map((course) => (
                    <option key={course.id_curso} value={course.id_curso}>
                      {course.nombre_curso}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <i className="bi bi-tags me-2"></i>
                  Categoría *
                </label>
                <select
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id_categoria} value={category.id_categoria}>
                      {category.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                <i className="bi bi-file-earmark-arrow-up me-2"></i>
                Archivo *
              </label>
              <div className="card border-dashed p-3">
                <input
                  id="fileInput"
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  required
                />
                <small className="text-muted d-block mt-2">
                  Formatos aceptados: PDF, DOCX (Tamaño máximo: 25MB)
                </small>
              </div>
              
              {formData.archivo && (
                <div className="mt-3">
                  <div className="alert alert-success d-flex align-items-center p-2">
                    <i className="bi bi-file-earmark-check fs-4 me-2"></i>
                    <div>
                      <strong>{formData.archivo.name}</strong>
                      <div className="text-muted small">
                        {(formData.archivo.size / 1024 / 1024).toFixed(2)} MB - {formData.archivo.type}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <i className="bi bi-upload me-2"></i>
                    Subir Recurso
                  </>
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
