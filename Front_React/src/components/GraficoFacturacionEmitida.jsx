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
        const respuesta = await getAllData();

        if (respuesta.status === 200) {
          const res = respuesta.data;
          const grupos = {};

          res.forEach((obj) => {
            const fecha = obj.fecha.substring(0, 7);

            if (!grupos[fecha]) {
              grupos[fecha] = [];
            }

            grupos[fecha].push(obj);
          });

          //Eje X ordenado por Fechas
          const labels = Object.keys(grupos).sort(); // Ordenar las fechas de menor a mayor
          const maxVisibleBars = 7;
          const startIndex = Math.max(
            0,
            labels.length - maxVisibleBars - scrollData
          );
          const endIndex = startIndex + maxVisibleBars;
          const visibleLabels = labels.slice(startIndex, endIndex).reverse(); // Revertir el orden de las fechas

          //PRECIOS POR FECHAS
          const preciosPUE = [];
          const preciosPDD = [];

          //SEPARAR PUE Y PDD
          const tempIdsPUE = [];
          const tempIdsPDD = [];


          //Filtro de PUE y PDD en fechas.
          visibleLabels.forEach((fecha) => {
            const objetosPUE = grupos[fecha].filter(
              (obj) => obj.categoria === "PUE"
            );

            //Objencion precios de cada PUE
            const preciosObjetosPUE = objetosPUE.map((obj) => obj.precio_mxn);
            preciosPUE.push(preciosObjetosPUE.reduce((a, b) => a + b, 0));

            //Obtencion de data de PDD  
            const objetosPDD = grupos[fecha].filter(
              (obj) => obj.categoria === "PDD"
            );
            
            //Obtencion de data de PDD
            const idsObjetosPDD = objetosPDD.map((obj) => obj.id);
            tempIdsPDD.push(idsObjetosPDD);

            //Obtencion de ID de PUE
            const idsObjetosPUE = objetosPUE.map((obj) => obj.id);
            tempIdsPUE.push(idsObjetosPUE);
             
            //Obtencion de ID de PDD
            const preciosObjetosPDD = objetosPDD.map((obj) => obj.precio_mxn);
            preciosPDD.push(preciosObjetosPDD.reduce((a, b) => a + b, 0));
          });

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

  //Evento click, y obtencion de datos en grafico.
  const handleColumnClick = (event, chartElements) => {
    if (chartElements.length > 0) {
      const clickedIndex = chartElements[0].index;
      setIdsPUE(idsPUE[clickedIndex] ? idsPUE[clickedIndex] : null);
      setIdsPDD(idsPDD[clickedIndex] ? idsPDD[clickedIndex] : null);

      const datosColumna = chartData.datasets.map(
        (dataset) => dataset.data[clickedIndex]
      );

      // Actualiza el estado de datos de columna y muestra los detalles
      setClickedColumnData(datosColumna);
      setMostrarDetalles(true);
    }
  };


  //Scroll de grafico
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
        <div
          className="flex items-center justify-center bg-gray-100"
          onWheel={handleScroll}
        >
          {chartData && (
            <div className="w-full md:max-w-screen-md lg:max-w-screen-lg">
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
