import React, { useState, useEffect } from "react";
import { getDetallesData } from "../api/dataAPI";

const TablaDetalles = ({ selectedDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await getDetallesData();
        setData(respuesta.data);
        // console.log(respuesta);
        // console.log(selectedDate)
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="relative w-full flex flex-col shadow-lg mb-6 mt-4">
      <div className="block bg-trasperant m-4 p-4 text-black w-3/4 mx-auto overflox-x-auto">
        <table className="border-collapse border border-blue w-full" border="1">
          <thead className="border border-solid border-l-0 bo bg-blue-500 text-white">
            <tr>
              <th className="text-md px-4">RFC</th>
              <th className="text-md px-4">RAZON SOCIAL</th>
              <th className="text-md px-4">NO.FACTURAS</th>
              <th className="text-md py-4 px-4">PUE</th>
              <th className="text-md px-4">PDD</th>
              <th className="text-md px-4">NOMINA</th>
              <th className="text-md px-4">PUE+PDD+NOMINA</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter( item => item.fecha_tabla === selectedDate)
              .map( item => (
                <tr key={item.id} className="border-b border-blue-200 ">
                  <td className="text-md py-2 px-14">{item.rfc}</td>
                  <td className="text-md py-2 px-14">{item.razon_social}</td>
                  <td className="text-md py-2 px-14">{item.facturas}</td>
                  <td className="text-md py-2 px-14">{item.pue}</td>
                  <td className="text-md py-2 px-14">{item.pdd}</td>
                  <td className="text-md py-2 px-14">{item.nomina}</td>
                  <td className="text-md py-2 px-14">{item.all}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaDetalles;
