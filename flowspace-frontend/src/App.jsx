import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardDetail from './pages/BoardDetail';
import AdminDashboard from './pages/AdminDashboard'; 
import UserManagement from './pages/UserManagement';
import CalendarView from './pages/CalendarView';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Utama (Admin Dashboard) */}
        <Route path="/dashboard" element={token ? <AdminDashboard /> : <Navigate to="/" />} />
        
        {/* Halaman Kanban (Dipanggil pakai ID Board) */}
        <Route path="/board/:id" element={token ? <BoardDetail /> : <Navigate to="/" />} />
        
        {/* Halaman Admin (Bisa diakses lewat URL /admin juga) */}
        <Route path="/admin" element={token ? <AdminDashboard /> : <Navigate to="/" />} />

        {/* Halaman User Management */}
        <Route path="/users" element={token ? <UserManagement /> : <Navigate to="/" />} />

        {/* Halaman Kalender */}
        <Route path="/board/:id/calendar" element={token ? <CalendarView /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;