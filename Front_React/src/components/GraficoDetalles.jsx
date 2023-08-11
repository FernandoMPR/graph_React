import React, { useEffect, useState} from "react"
import { getAllData } from "../api/dataAPI.js";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
 
function DetallesGrafica ({fecha}) {
    const [chartData, setChartData] = useState();
    const [mostrarDetalles, setMostrarDetalles] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await getAllData();

        if (respuesta.status === 200) {
          const res = respuesta.data;
          const grupos = {};


          res.forEach((obj) => {
            const fechaObj = obj.fecha.substring(0, 7);
            // console.log("fechaObJ", fechaObj)
            if (!grupos[fechaObj]) {
              grupos[fechaObj] = [];
            }
            grupos[fechaObj].push(obj);
          });

          //
          const objetosPUE = grupos[fecha] && grupos[fecha].filter((obj) => obj.categoria === "PUE");
          const preciosObjetosPUE = objetosPUE ? objetosPUE.map((obj) => obj.precio_mxn) : [];
          const precioPUE = preciosObjetosPUE.reduce((a, b) => a + b, 0);
          
          const objetosPDD = grupos[fecha] && grupos[fecha].filter((obj) => obj.categoria === "PDD");
          const preciosObjetosPDD = objetosPDD ? objetosPDD.map((obj) => obj.precio_mxn) : [];
          const precioPDD = preciosObjetosPDD.reduce((a, b) => a + b, 0);



          const processedData = {
            labels: [fecha],
            datasets: [
              {
                label: "Pago en parcialidades o diferido (PPD)",
                data: [precioPDD],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
              {
                label: "Pago único (PUE)",
                data: [precioPUE],
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          };

          setChartData(processedData);
        } else {
          console.error("Respuesta no exitosa:");
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }

    fetchData();
  }, [fecha]);

const myOptions={
    scales:{
      x:{
        stacked:true , // Superponer en el eje x
        ticks:{
          autoSkip:false , // Evitar saltos automáticos en las etiquetas
          maxRotation:100 , // Rotación del texto de las etiquetas (0 grados)
          minRotation:40 , // Rotación del texto de las etiquetas (0 grados)
          fontSize:19 , // Tamaño de fuente de las etiquetas
        },
      },
      y:{
        stacked:true , // Superponer en el eje y
        title:{
          display:true ,
          text:"Facturacion en pesos (MXN)" ,
          font:{
            size:18 ,
            lineHeight:3.2 ,
          },
        },
        padding:{
          top:20 , // Margen superior del eje y
        },
      },
    },
};

return (
  <div>
    {mostrarDetalles ? (
      <BarChart/>
    ) : (
      <div style={{ width: "50%" }}>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => setMostrarDetalles(!mostrarDetalles)}
        >
          Button
        </button>
        <div>
          {chartData && <Bar data={chartData} options={myOptions} />}
        </div>
        <div>
          <TablaDetalles />
        </div>
      </div>
    )}
  </div>
);
    }

export default DetallesGrafica
