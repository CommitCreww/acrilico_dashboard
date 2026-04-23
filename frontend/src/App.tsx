import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Pedidos from "./pages/Pedidos"
import Clientes from "./pages/Clientes"
import Materiais from "./pages/Materiais"
import Colaboradores from "./pages/Colaboradores"

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <Pedidos />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/materiais"
          element={
            <PrivateRoute>
              <Materiais />
            </PrivateRoute>
          }
        />
        <Route
          path="/colaboradores"
          element={
            <PrivateRoute>
              <Colaboradores />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
