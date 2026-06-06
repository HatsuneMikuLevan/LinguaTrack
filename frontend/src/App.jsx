import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';  // ← добавь useTheme
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-peach-50 to-sky-100 dark:bg-slate-900 flex items-center justify-center text-rose-800 dark:text-rose-100">
        Загрузка...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-rose-50 via-peach-50 to-sky-100'}`}>
          {/* декоративные круги */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-amber-200/20 rounded-full blur-[100px]" />
          
          <div className="max-w-md w-full backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/50 dark:border-slate-700 overflow-hidden min-h-[600px]">
            <div className="p-8 relative z-10">
              <header className="mb-6 text-center">
                <h1 className="text-4xl font-black text-rose-900 dark:text-rose-100 tracking-tighter mb-2">
                  LinguaTrack
                </h1>
                <div className="h-1 w-12 bg-gradient-to-r from-rose-400 to-peach-400 mx-auto rounded-full" />
              </header>
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </div>
        </div>
        <Toaster position="top-center" toastOptions={{
          style: { 
            background: '#fff1f2', 
            border: '1px solid #fecdd3', 
            color: '#881337',
            fontFamily: 'Arial Unicode MS, Arial, sans-serif'
          }
        }} />
      </Router>
    </AuthProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;