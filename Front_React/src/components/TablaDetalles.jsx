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
      <table
        className="min-w-full table-auto border-collapse border border-blue"
        border="1"
      >
        <thead className="border border-solid border-l-0 bo bg-blue-500 text-white">
          <tr>
            {data &&
              data.length > 0 &&
              Object.keys(data[0])
                .filter((field) => field !== "id" && field !== "fecha_tabla")
                .map((field, index) => (
                  <th key={index} className="px-2 py-1 md:px-4 md:py-2" style={{ textTransform: 'uppercase' }}>
                    {field.replace(/_/g, ' ')}
                  </th>
                ))}
          </tr>
        </thead>
        <tbody>
          {data
            .filter((item) => item.fecha_tabla === selectedDate)
            .map((item) => (
              <tr key={item.id} className="border-b border-blue-200">
                {Object.keys(item)
                  .filter((field) => field !== "id" && field !== "fecha_tabla")
                  .map((field, index) => (
                    <td
                      key={index}
                      className="px-2 py-1 md:px-4 md:py-2 whitespace-nowrap text-center"
                    >
                      {item[field]}
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDetalles;
