import React, { useEffect, useState } from 'react';
import AxiosInstance from './axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const ResponderIncidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    AxiosInstance.get('respoincidencias/')
      .then((res) => setIncidencias(res.data))
      .catch((err) => console.error('Error al obtener incidencias:', err));
  }, []);

  const handleRespuestaChange = (id, value) => {
    setRespuestas((prev) => ({ ...prev, [id]: value }));
  };

  const handleResponder = (id) => {
    const respuesta = respuestas[id];
    if (!respuesta) return;

    AxiosInstance.patch(`incidencias/${id}/respuesta/`, { respuesta })
      .then(() => {
        alert('Respuesta enviada correctamente');
        // Actualizar incidencia en UI (marcar como respondida)
        setIncidencias((prev) =>
          prev.map((incidencia) =>
            incidencia.id === id ? { ...incidencia, respuesta } : incidencia
          )
        );
      })
      .catch((err) => {
        console.error('Error al responder incidencia:', err.response?.data || err.message);
        alert('No se pudo responder la incidencia');
      });
  };

  return (
    <Box mt={5}>
      <Typography variant="h5" gutterBottom>
        Responder Incidencias
      </Typography>
      {incidencias.length === 0 ? (
        <Typography>No hay incidencias registradas.</Typography>
      ) : (
        incidencias.map((incidencia) => {
          const yaRespondida = !!incidencia.respuesta;
          return (
            <Card key={incidencia.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography><strong>Usuario:</strong> {incidencia.nombre_usuario}</Typography>
                <Typography><strong>Tipo:</strong> {incidencia.tipo}</Typography>
                <Typography><strong>Motivo:</strong> {incidencia.motivo}</Typography>
                <Typography><strong>Fecha:</strong> {new Date(incidencia.fecha).toLocaleString()}</Typography>

                <TextField
                  label="Respuesta"
                  value={yaRespondida ? incidencia.respuesta : (respuestas[incidencia.id] || '')}
                  onChange={(e) => handleRespuestaChange(incidencia.id, e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  disabled={yaRespondida}
                />

                <Button
                  variant="contained"
                  onClick={() => handleResponder(incidencia.id)}
                  disabled={yaRespondida || !respuestas[incidencia.id]}
                  sx={{
                    backgroundColor: '#32129a',
                    '&:hover': { backgroundColor: '#5d3397' },
                  }}
                >
                  Enviar Respuesta
                </Button>

                {yaRespondida && (
                  <Typography variant="body2" color="green" mt={1}>
                    Esta incidencia ya fue respondida.
                  </Typography>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default ResponderIncidencias;
