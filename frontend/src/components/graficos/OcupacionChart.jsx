import React, { useEffect, useState } from 'react';
import AxiosInstance from '../axios'; // Ajusta la ruta de AxiosInstance
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const colors = {
  alumno: '#ec5a68',
  docente_admin: '#32129a',
  moto: '#0088FE',
};

const PieChartComponent = () => {
  const [data, setData] = useState([
    { name: 'alumno', value: 0 },
    { name: 'docente_admin', value: 0 },
    { name: 'moto', value: 0 },
  ]);


  // Función para obtener los datos del backend
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get('obtener-registros/');
      const rolesData = response.data;

      // Mapa inicial con valores en 0
      const baseData = {
        alumno: 0,
        docente_admin: 0,
        moto: 0,
      };

      // Reemplazar valores si existen en la respuesta
      rolesData.forEach(rol => {
        baseData[rol.rol] = rol.count;
      });

      // Convertir a formato de gráfico
      const formattedData = Object.entries(baseData).map(([name, value]) => ({
        name,
        value,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };


  useEffect(() => {
    fetchData(); // Obtener los datos cuando se monta el componente
  
     // Actualizar automáticamente cada 5 segundos
     const interval = setInterval(() => {
      fetchData();
    }, 300000); // Cambia el tiempo según tu necesidad (5000 ms = 5 segundos)

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  
  }, []);

  // Calcular el total de los valores para calcular el porcentaje
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const chartData = data
        .filter(entry => entry.value > 0)
        .map(entry => ({
          ...entry,
          displayName: entry.name === 'docente_admin' ? 'Doc/Adm' : entry.name
        }));


  return (
    <div style={{ width: '100%', height: 400, marginTop: '-60px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            label={({ index }) => `${chartData[index].displayName}`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry.name] || '#cccccc'} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Leyenda personalizada */}
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: '-40px' }}>
        {data.map((entry, index) => {
          // Calcular el porcentaje de cada entrada
          const percentage = total > 0 ? (((entry.value || 0) / total) * 100).toFixed(2) : '0.00';

          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: colors[entry.name] || '#cccccc',
                  marginRight: '5px',
                }}
              />
              <div>{`${entry.name}: ${entry.value} (${percentage}%)`}</div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChartComponent;
