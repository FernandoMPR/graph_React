import React, { useState, useEffect } from "react";
import { getDetallesData } from "../api/dataAPI";

const TablaDetalles = () => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        async function fetchData() {
            try {
                const respuesta = await getDetallesData(); 
                setData(respuesta.data);
                console.log(data)
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        }
        
        fetchData();
    }, []);
    
    return (
        <div className="text-black">
            <table className="border-collapse border-blue-500 w-full" border="1">
                <thead className="bg-blue-500 text-white">
                    <tr >
                        <th>RFC</th>
                        <th>RAZON SOCIAL</th>
                        <th>NO.FACTURAS</th>
                        <th>PUE</th>
                        <th>PDD</th>
                        <th>NOMINA</th>
                        <th>PUE+PDD+NOMINA</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id} className="border-b border-blue-200">
                            <td className="py-2 px-4">{item.rfc}</td>
                            <td className="py-2 px-14">{item.razon_social}</td>
                            <td className="py-2 px-14">{item.facturas}</td>
                            <td className="py-2 px-14">{item.pue}</td>
                            <td className="py-2 px-14">{item.pdd}</td>
                            <td className="py-2 px-14">{item.nomina}</td>
                            <td className="py-2 px-14">{item.all}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablaDetalles;
