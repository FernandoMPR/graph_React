import axios from "axios";

export const getAllData = () => {
  return axios.get(
    "https://graph-con-django-y-react.onrender.com/FacturacionNomina/api/v1/FacturacionNomina/"
  );
};

export const getDetallesData = () => {
  return axios.get(
    "https://graph-con-django-y-react.onrender.com/FacturacionNomina/api/v1/DetallesFactura/"
  );
};

export const getDataById = async (facturacionId) => {
  try {
    const response = await axios.get(
      `https://graph-con-django-y-react.onrender.com/FacturacionNomina/api/v1/DetallesFactura/get_facturacion/${facturacionId}/`
    );
    if (response.status === 200) {
      return response;
    } else {
      return undefined;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return undefined;
    }
    throw error;
  }
};

export const getDataByIdPdd = async (facturacionIdPdd) => {
  try {
    const response = await axios.get(
      `https://graph-con-django-y-react.onrender.com/FacturacionNomina/api/v1/DetallesFactura/get_facturacion/${facturacionIdPdd}/`
    );
    if (response.status === 200) {
      return response;
    } else {
      return undefined;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return undefined;
    }
    throw error;
  }
};
