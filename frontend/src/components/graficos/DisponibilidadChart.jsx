import React, { useState, useEffect } from 'react';
import AxiosInstance from '../axios'; // Ajusta la ruta según tu estructura
import { PieChart, Pie, Cell } from 'recharts';

const RADIAN = Math.PI / 180;

const TOTAL_ALUMNO = 168;
const TOTAL_DOCADM = 149;
const TOTAL_MOTOS = 16;

const cx = 150;
const cy = 200;
const iR = 50;
const oR = 100;

const colors = {
  disponibles: '#818181',
  alumno: '#ec5a68',
  docente: '#32129a',
  motos: '#0088FE',
};

const needle = (value, data, cx, cy, iR, oR, color) => {
  let total = 0;
  data.forEach((v) => (total += v.value));
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" key="circle" />,
    <path
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="none"
      fill={color}
      key="needle"
    />,
  ];
};

const EstacionamientoChart = () => {
  const [data, setData] = useState([]);
  const [lugaresDisponibles, setLugaresDisponibles] = useState(0);
  const [ocupados, setOcupados] = useState({
    alumno: 0,
    docente: 0,
    motos: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get('obtener-registros/');
        const rolesData = response.data;

        const usuariosAlumnos = rolesData.find((rol) => rol.rol === 'alumno')?.count || 0;
        const usuariosDocentes = rolesData.find((rol) => rol.rol === 'docente_admin')?.count || 0;
        const usuariosMotos = rolesData.find((rol) => rol.rol === 'moto')?.count || 0;

        const disponiblesAlumnos = Math.max(0, TOTAL_ALUMNO - usuariosAlumnos);
        const disponiblesDocentes = Math.max(0, TOTAL_DOCADM - usuariosDocentes);
        const disponiblesMotos = Math.max(0, TOTAL_MOTOS - usuariosMotos);
        const totalDisponibles = disponiblesAlumnos + disponiblesDocentes + disponiblesMotos;


        setLugaresDisponibles(totalDisponibles);
        setOcupados({ alumno: usuariosAlumnos, docente: usuariosDocentes, motos: usuariosMotos, total: totalDisponibles});

        setData([
          { name: 'Disponibles', value: totalDisponibles, color: colors.disponibles },
          { name: 'Ocupados Alumnos', value: usuariosAlumnos, color: colors.alumno },
          { name: 'Ocupados Docentes', value: usuariosDocentes, color: colors.docente },
          { name: 'Ocupados Motos', value: usuariosMotos, color: colors.motos },
        ]);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <PieChart width={400} height={500}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(lugaresDisponibles, data, cx, cy, iR, oR, '#d0d000')}
      </PieChart>

      {/* 🔹 Leyenda apilada en 2x2 */}
      <div style={styles.legendContainer}>
        <div style={styles.legendRow}>
          <div style={{ ...styles.legendItem, backgroundColor: colors.alumno }}>
            Alumnos: {Math.max(0, TOTAL_ALUMNO - ocupados.alumno)} 
          </div>
          <div style={{ ...styles.legendItem, backgroundColor: colors.docente }}>
            Docentes y Administrativos: {Math.max(0, TOTAL_DOCADM - ocupados.docente)} 
          </div>
        </div>
        <div style={styles.legendRow}>
          <div style={{ ...styles.legendItem, backgroundColor: colors.motos }}>
            Motocicletas: {Math.max(0, TOTAL_MOTOS - ocupados.motos)}
          </div>
          <div style={{ ...styles.legendItem, backgroundColor: colors.disponibles }}>
            Total de lugares: { ocupados.total} 
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  legendContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '-220px',
  },
  legendRow: {
    display: 'flex',
    gap: '10px',
  },
  legendItem: {
    padding: '5px 10px',
    color: 'white',
    borderRadius: '5px',
    fontWeight: 'bold',
    width: '150px', // Controla el tamaño de cada caja
  },
};
export default EstacionamientoChart;
