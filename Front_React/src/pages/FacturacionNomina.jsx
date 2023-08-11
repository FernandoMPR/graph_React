import BarChart from "../components/GraficoFacturacionEmitida";

export const FacturacionNomina = () => {
  return (
    <div>
      <p className="text-black font-serif text-xl ml-4 mb-3 ">
        Facturacion emitida y nomina cobrada
      </p>
      <BarChart />
    </div>
  );
};
