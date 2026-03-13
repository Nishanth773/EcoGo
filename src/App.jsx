import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import DriverDashboard from './pages/DriverDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import NavBar from './components/NavBar';
import './App.css';

function ProtectedRoute({ children, allowedRole }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRole && currentUser.role !== allowedRole && currentUser.role !== 'manager') {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }
  return children;
}

function AppShell() {
  const { currentUser } = useApp();
  return (
    <div className="app-container">
      {currentUser && <NavBar />}
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role}`} replace /> : <LoginPage />} />
          <Route path="/" element={<Navigate to={currentUser ? `/${currentUser.role}` : '/login'} replace />} />
          <Route path="/driver" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute allowedRole="manager"><ManagerDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </Router>
  );
}

export default App;
