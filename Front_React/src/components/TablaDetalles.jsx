import React, { useState, useEffect } from "react";
import { getDetallesData } from "../api/dataAPI";

const TablaDetalles = ({ selectedDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await getDetallesData();
        setData(respuesta.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }

    fetchData();
  }, []);
  return (
        <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-blue" border="1">
          <thead className="border border-solid border-l-0 bo bg-blue-500 text-white">
            <tr>
              <th className="px-2 py-1 md:px-4 md:py-2">RFC</th>
              <th className="px-2 py-1 md:px-4 md:py-2">RAZON SOCIAL</th>
              <th className="px-2 py-1 md:px-4 md:py-2">NO.FACTURAS</th>
              <th className="px-2 py-1 md:px-4 md:py-2">PUE</th>
              <th className="px-2 py-1 md:px-4 md:py-2">PDD</th>
              <th className="px-2 py-1 md:px-4 md:py-2">NOMINA</th>
              <th className="px-2 py-1 md:px-4 md:py-2">PUE+PDD+NOMINA</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter( item => item.fecha_tabla === selectedDate)
              .map( item => (
                <tr key={item.id} className="border-b border-blue-200 ">
                  <td className="px-2 py-1 md:px-4 md:py-2 whitespace-nowrap text-center">{item.rfc}</td>
                  <td className="px-2 py-1 md:px-4 md:py-2 whitespace-nowrap text-center">{item.razon_social}</td>
                  <td className="px-2 py-1 md:px-4 md:py-2 whitespace-nowrap text-center">{item.facturas}</td>
                  <td className="px-2 py-1 md:px-4 md:py-2 whitespace-nowrap text-center">{item.pue}</td>
                  <td className="px-2 py-1 md:px-4 md:py-2 whitespace-nowrap text-center">{item.pdd}</td>
                  <td className="px-2 py-1 md:px-4 md:py-2 whitespace-nowrap text-center">{item.nomina}</td>
                  <td className="px-2 py-1 md:px-4 md:py-2 whitespace-nowrap text-center">{item.all}</td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
  );
};

export default TablaDetalles;
