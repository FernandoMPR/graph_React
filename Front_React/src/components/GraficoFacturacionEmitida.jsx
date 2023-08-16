import React, { useEffect, useState } from "react";
import { getAllData } from "../api/dataAPI.js";
import "../styles/grafico.css";
import { Bar } from "react-chartjs-2";
import DetallesGrafica from "./GraficoDetalles.jsx";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BarChart = () => {
  const [chartData, setChartData] = useState();
  const [scrollData, setScrollData] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [clickedColumnData, setClickedColumnData] = useState([]);
  const [idsPUE, setIdsPUE] = useState([]);
  const [idsPDD, setIdsPDD] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        function obtenerPrecios(objetos) {
          return objetos
            .map((obj) => obj.precio_mxn)
            .reduce((a, b) => a + b, 0);
        }
        const respuesta = await getAllData();
        if (respuesta.status === 200) {
          const res = respuesta.data;

          // Agrupar por fechas
          const grupos = res.reduce((acc, obj) => {
            const fecha = obj.fecha.substring(0, 7);
            if (!acc[fecha]) {
              acc[fecha] = [];
            }
            acc[fecha].push(obj);
            return acc;
          }, {});

          // Obtener fechas visibles
          const labels = Object.keys(grupos).sort();
          const maxVisibleBars = 7;
          const startIndex = Math.max(
            0,
            labels.length - maxVisibleBars - scrollData
          );
          const endIndex = startIndex + maxVisibleBars;
          const visibleLabels = labels.slice(startIndex, endIndex).reverse();

          // Precios y IDs por fechas
          const preciosPUE = [];
          const preciosPDD = [];
          const tempIdsPUE = [];
          const tempIdsPDD = [];

          visibleLabels.forEach((fecha) => {
            const objetosFecha = grupos[fecha];
            
            const objetosPUE = objetosFecha.filter(
              (obj) => obj.categoria === "PUE"
            );
            const objetosPDD = objetosFecha.filter(
              (obj) => obj.categoria === "PDD"
            );

            preciosPUE.push(obtenerPrecios(objetosPUE));
            preciosPDD.push(obtenerPrecios(objetosPDD));

            tempIdsPUE.push(objetosPUE.map((obj) => obj.id));
            tempIdsPDD.push(objetosPDD.map((obj) => obj.id));
          });

          // Procesar datos
          const processedData = {
            labels: visibleLabels,
            datasets: [
              {
                label: "Pago en parcialidades o diferido (PPD)",
                data: preciosPDD,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
              },
              {
                label: "Pago único (PUE)",
                data: preciosPUE,
                backgroundColor: "rgba(248, 29, 85, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
              },
            ],
          };

          // Actualizar estados
          setIdsPUE(tempIdsPUE);
          setIdsPDD(tempIdsPDD);
          setChartData(processedData);
        } else {
          console.error("Respuesta no exitosa:");
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }

    fetchData();
  }, [scrollData]);

  const handleColumnClick = (event, chartElements) => {
    if (chartElements.length > 0) {
      const clickedIndex = chartElements[0].index;
      const newIdsPUE = idsPUE[clickedIndex] || null;
      const newIdsPDD = idsPDD[clickedIndex] || null;
      const datosColumna = chartData.datasets.map(
        (dataset) => dataset.data[clickedIndex]
      );

      setIdsPUE(newIdsPUE);
      setIdsPDD(newIdsPDD);
      setClickedColumnData(datosColumna);
      setMostrarDetalles(true);
    }
  };

  const handleScroll = (event) => {
    const scrollDirection = event.deltaY > 0 ? 1 : -1;
    setScrollData((prevScroll) => prevScroll + scrollDirection);
  };

  const myOptions = {
    maintainAspectRatio: window.innerWidth >= 768,
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
    //Colocar mouse pointer solo a barra
    onHover: (event, elements) => {
      if (elements.length > 0) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    },
  };

  return (
    <>
      {mostrarDetalles ? (
        <DetallesGrafica
          clickedColumnData={clickedColumnData}
          pueID={idsPUE}
          pddID={idsPDD}
        />
      ) : (
        <div onWheel={handleScroll}>
          {chartData && (
            <div>
              <Bar
                data={chartData}
                options={{
                  ...myOptions,
                  onClick: (event, chartElements) =>
                    handleColumnClick(event, chartElements),
                  onHover: (event, elements) => {
                    if (elements.length > 0) {
                      setHovered(true);
                    } else {
                      setHovered(false);
                    }
                  },
                }}
                style={{ cursor: hovered ? "pointer" : "default" }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BarChart;
