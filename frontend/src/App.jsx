import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import GuestRoute from './components/GuestRoute'
import Pets from './pages/Pets'
import PetsDetail from './pages/PetsDetail'
import Hosts from './components/Hosts'
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav className="bg-white shadow p-4 flex gap-6 text-blue-600 font-semibold mb-6">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/mascotas" className="hover:underline">Mis Mascotas</Link>
        <Link to="/cuidadores" className="hover:underline">Cuidadores</Link>
      </nav>

      <Routes>
        <Route
          path="/"
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
          </PrivateRoute>} />
          <Route 
          path="/cuidadores" 
          element={
            <PrivateRoute>
              <Hosts />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
