import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import TablaDetalles from "./TablaDetalles.jsx";
import BarChart from "./GraficoFacturacionEmitida.jsx";
import { getDataById, getDataByIdPdd } from "../api/dataAPI.js";
import { Button } from "./button.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function DetallesGrafica(props) {
  const [chartData, setChartData] = useState();
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        let respuesta = null;
        let respuestaPDD = null;

        if (props.pueID) {
          respuesta = await getDataById(props.pueID);
        }

        if (props.pddID) {
          respuestaPDD = await getDataByIdPdd(props.pddID);
        }

        const res = respuesta?.data;
        const resPDD = respuestaPDD?.data;

        let formattedFechaClickeada = "";
        let precioPUE = null;
        let precioPDD = null;

        if (res) {
          const fechaClickeada = res.fecha;
          const fechaObj = new Date(`${fechaClickeada}T00:00:00Z`);
          formattedFechaClickeada = fechaClickeada
            ? `${fechaObj.getUTCFullYear()}-${(fechaObj.getUTCMonth() + 1).toString().padStart(2, '0')}`
            : "";
          precioPUE = res.precio_mxn;
          setSelectedDate(fechaClickeada);
        }

        if (resPDD) {
          precioPDD = resPDD.precio_mxn;
        }


        ////////////////////////////////////////////////////////////

        const processedData = {
          labels: [formattedFechaClickeada],
          datasets: [
            {
              label: "Pago único (PUE)",
              data: [precioPUE],
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
            },
            {
              label: "Pago en parcialidades o diferido (PPD)",
              data: [precioPDD],
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
            },
          ],
        };
        setChartData(processedData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }
    fetchData();
  }, []);

  const myOptions = {
    scales: {
      x: {
        stacked: true, // Superponer en el eje x
        ticks: {
          autoSkip: false, // Evitar saltos automáticos en las etiquetas
          maxRotation: 100, // Rotación del texto de las etiquetas (0 grados)
          minRotation: 40, // Rotación del texto de las etiquetas (0 grados)
          fontSize: 19, // Tamaño de fuente de las etiquetas
        },
      },
      y: {
        stacked: true, // Superponer en el eje y
        title: {
          display: true,
          text: "Facturacion en pesos (MXN)",
          font: {
            size: 18,
            lineHeight: 3.2,
          },
        },
        padding: {
          top: 20, // Margen superior del eje y
        },
      },
    },
  };

  return (
    <div>
      {mostrarDetalles ? (
        <BarChart />
        
      ) : (
        <div>
          <Button mostrarDetalles={mostrarDetalles} setMostrarDetalles={setMostrarDetalles}/>
          <div className="w-full md:w-1/2 mx-auto">
            {chartData && <Bar data={chartData} options={myOptions} />}
          </div>
          <div className="w-full text-black mt-14">
            <TablaDetalles  selectedDate={selectedDate}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetallesGrafica;
