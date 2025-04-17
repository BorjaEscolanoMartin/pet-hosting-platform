import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import GuestRoute from './components/GuestRoute'
import Pets from './pages/Pets'
import PetsDetail from './pages/PetsDetail'
import Hosts from './components/Hosts'
import DashboardCuidador from './pages/DashboardCuidador'
import DashboardEmpresa from './pages/DashboardEmpresa'

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirección automática al dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route 
          path="/mascotas" 
          element={
            <PrivateRoute>
              <Pets />
            </PrivateRoute>
          }    
        />
        <Route 
          path="/mascotas/:id" 
          element={
            <PrivateRoute>
              <PetsDetail />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cuidadores" 
          element={
            <PrivateRoute>
              <Hosts />
            </PrivateRoute>
          } 
        />
        <Route
          path="/dashboard-cuidador"
          element={
            <PrivateRoute>
              <DashboardCuidador />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-empresa"
          element={
            <PrivateRoute>
              <DashboardEmpresa />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
