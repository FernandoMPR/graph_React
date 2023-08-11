import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import { FacturacionNomina } from "./pages/FacturacionNomina.jsx"


function App() {
  return (
    <BrowserRouter>
      <div className="container  mx-auto bg-zinc-100 py-5 rounded-lg ">
        <Routes>
          <Route path="/" element={<Navigate to="/FacturacionEmitida"/>} />
          <Route path="/FacturacionEmitida" element={<FacturacionNomina/>} />
        </Routes>
      </div> 
    </BrowserRouter>
  )
}

export default App