import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthContext } from './context/AuthContext';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useContext(AuthContext);
  
  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  
  return children;
};

// Public Route wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  
  if (token) return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Global Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-blob c1" style={{ width: '600px', height: '600px', background: '#6366f1', top: '-10%', left: '-10%' }}></div>
        <div className="mesh-blob c2" style={{ width: '700px', height: '700px', background: '#0ea5e9', bottom: '-10%', right: '-10%', animationDelay: '-5s' }}></div>
        <div className="mesh-blob c3" style={{ width: '500px', height: '500px', background: '#8b5cf6', top: '40%', left: '30%', animationDelay: '-10s' }}></div>
      </div>

      <Navbar />
      <main className="relative z-10">
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
