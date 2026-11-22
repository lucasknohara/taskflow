import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';

function FullPageLoading() {
  return <div className="grid min-h-screen place-items-center bg-canvas"><div className="flex items-center gap-2.5"><span className="h-2 w-2 animate-pulse rounded-full bg-accent" /><span className="text-xs font-medium text-muted">Preparando seu espaço...</span></div></div>;
}

function Protected({ children }) {
  const { user, booting } = useAuth();
  const location = useLocation();
  if (booting) return <FullPageLoading />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/boards" element={<Protected><BoardsPage /></Protected>} />
      <Route path="/boards/:boardId" element={<Protected><BoardPage /></Protected>} />
      <Route path="*" element={<Navigate to="/boards" replace />} />
    </Routes>
  );
}
