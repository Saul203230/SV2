import { useState, useEffect } from 'react'
import './App.css'
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import PaginaGraficos from './components/PaginaGraficos'
import PaginaRegistros from './components/PaginaRegistros'
import PaginaUsuarios from './components/PaginaUsuarios'
import PaginaAutos from './components/PaginaAutos'
import PaginaIncidencias from './components/PaginaIncidencias'
import PaginaReportes from './components/PaginaReportes'
import PaginaResponderIncidencias from './components/PaginaResponderIncidencias'
import Navbar from './components/Navbar'
import Login from './components/Login';
import Register from './components/register'
import PrivateRoute from './components/RutaPrivada';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // <-- añadido
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    const userRole = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  // Función para logout
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role'); // <-- opcional pero recomendable
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <>
      {isAuthenticated ? (
        <div style={{ display: 'flex' }}>
          <Navbar onLogout={handleLogout} />
          <div style={{ flexGrow: 1, padding: '70px' }}>
            <Routes>
              <Route path="/" element={<PaginaGraficos />} />
              <Route path="/PaginaRegistros" element={<PrivateRoute allowedRoles={['guardia']}> <PaginaRegistros/> </PrivateRoute>} />
              <Route path="/PaginaUsuarios" element={<PrivateRoute allowedRoles={['guardia']}> <PaginaUsuarios/> </PrivateRoute>} />
              <Route path="/PaginaAutos" element={<PrivateRoute allowedRoles={['guardia']}> <PaginaAutos /> </PrivateRoute>} />
              <Route path="/PaginaIncidencias" element={<PrivateRoute allowedRoles={['guardia']}> <PaginaIncidencias/> </PrivateRoute>} />
              <Route path="/PaginaReportes" element={<PrivateRoute allowedRoles={['administrativo']}> <PaginaReportes/> </PrivateRoute>} />
              <Route path="/PaginaResponderIncidencias" element={<PrivateRoute allowedRoles={['administrativo']}> <PaginaResponderIncidencias/> </PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;