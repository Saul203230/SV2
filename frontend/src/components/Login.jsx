import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await axios.post('http://localhost:8000/login/', {
        username,
        password,
      });

      const access = response.data.access;
      const refresh = response.data.refresh;

      const decoded = jwtDecode(access);
      const role = decoded.role;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('role', role);

      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      setErrorMsg('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          {/* Logo */}
          <img
            src="/img/tsj.png" // Cambia esto a tu ruta local o URL real del logo
            alt="Logo"
            style={{ height: 99 }}
          />
        </Box>
        <Typography variant="h5" align="center" gutterBottom>
          Tablero de Gestion TSJ
        </Typography>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errorMsg}
            sx={{
                '& label.Mui-focused': {
                  color: '#32129a', // color del label al enfocar
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#32129a', // color del borde al enfocar
                  },
                },
              }}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errorMsg}
            sx={{
                '& label.Mui-focused': {
                  color: '#32129a', // color del label al enfocar
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#32129a', // color del borde al enfocar
                  },
                },
              }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, backgroundColor:'#32129a' }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
