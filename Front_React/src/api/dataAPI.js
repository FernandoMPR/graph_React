import axios from "axios"

export const getAllData = () => {
    return axios.get("http://localhost:8000/FacturacionNomina/api/v1/FacturacionNomina/")
}

export const getDetallesData = () => {
    return axios.get("http://localhost:8000/FacturacionNomina/api/v1/DetallesFactura/")
}
