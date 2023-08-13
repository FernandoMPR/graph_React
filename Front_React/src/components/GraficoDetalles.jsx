import React, { useEffect, useState } from "react";
import { format } from "date-fns";
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
        const pueID = props.pueID.length > 0 ? props.pueID : null;
        const facturaID = pueID;
        const pddID = props.pddID.length > 0 ? props.pddID : null;
        const facturaIdPDD = pddID;

        let respuesta = null;
        if (pueID) {
          respuesta = await getDataById(facturaID);
        }

        let respuestaPDD = null;
        if (pddID) {
          respuestaPDD = await getDataByIdPdd(facturaIdPDD);
        }

        const res = respuesta?.data;
        const resPDD = respuestaPDD?.data;
        // console.log("pdd",resPDD)

        const fechaClickeada = res?.fecha;
        const fechaObj = new Date(`${fechaClickeada}T00:00:00Z`); 
        const formattedFechaClickeada = fechaClickeada
        ? `${fechaObj.getUTCFullYear()}-${(fechaObj.getUTCMonth() + 1).toString().padStart(2, '0')}`
        : "";
        // console.log(formattedFechaClickeada)
        setSelectedDate(fechaClickeada)
        // console.log(fechaClickeada)

        const precioPUE = res?.precio_mxn;
        const precioPDD = resPDD?.precio_mxn;
        // console.log("prePDD", precioPDD)

        ////////////////////////////////////////////////////////////

        const processedData = {
          labels: [formattedFechaClickeada],
          datasets: [
            {
              label: "Pago único (PUE)",
              data: [precioPUE ? precioPUE : "0"],
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
        <div className="">
          <button
            className="bg-white bg-opacity-20 hover:bg-opacity-60 text-gray-600  font-bold rounded-full w-12 h-12 flex items-center justify-center shadow hover:shadow-lg transition duration-300"
            onClick={() => setMostrarDetalles(!mostrarDetalles)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform rotate-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div className="w-1/2 mx-auto">
            {chartData && <Bar data={chartData} options={myOptions} />}
          </div>
          <div>
            <TablaDetalles  selectedDate={selectedDate}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetallesGrafica;
