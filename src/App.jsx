
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import AdminDashboard from './components/dashboard/AdminDashboard';
import DocenteDashboard from './components/dashboard/DocenteDashboard';
import EstudianteDashboard from './components/dashboard/EstudianteDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/docente-dashboard" element={<DocenteDashboard />} />
        <Route path="/estudiante-dashboard" element={<EstudianteDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
