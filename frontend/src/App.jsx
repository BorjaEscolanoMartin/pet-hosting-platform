import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import GuestRoute from './components/GuestRoute'
import Pets from './pages/Pets'
import PetsDetail from './pages/PetsDetail'

function App() {
  return (
    <Router>
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
          </PrivateRoute>} />
          <Route 
          path="/mascotas/:id" 
          element={
          <PrivateRoute>
            <PetsDetail />
          </PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App
