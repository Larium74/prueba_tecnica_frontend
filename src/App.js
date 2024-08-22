import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Registro from "./components/Registro";
import { UserProvider } from "./components/UserProvider.js"; // Importa el UserProvider
import Tareas from "./components/Tareas.js";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/tareas" element={<Tareas />} /> {/* Ruta para la lista de tareas */}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;