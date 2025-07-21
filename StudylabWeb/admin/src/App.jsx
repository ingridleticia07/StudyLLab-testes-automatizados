import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Menu from './components/Menu/Menu';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import Users from './pages/Users';
import Materials from './pages/Materials';
import Report from './pages/Report';
import Help from './pages/Help';

import {
  authTokenIsValid,
  saveDashboardSessionInfos,
  logoutSession,
} from '../../platform/repository/auth.js';

function App() {
  const [authStatus, setAuthStatus] = useState(null);
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    saveDashboardSessionInfos();
    const verifyAuth = async () => {
      try {
        const isAuthenticated = await authTokenIsValid();
        setAuthStatus(isAuthenticated);
      } catch (error) {
        setAuthStatus(false);
      }
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (authStatus === false && !hasAlerted) {
      setHasAlerted(true);
      alert('Sua sessão expirou. Logue novamente!');
      logoutSession();
      window.location.href = 'http://localhost:5174/';
    }
  }, [authStatus]);

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col md:flex-row">
      {/* Sidebar no topo em mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <Sidebar isMobile />
      </div>

      {/* Menu lateral + Sidebar em desktop */}
      <div className="hidden md:flex md:flex-col">
        <Menu />
        <Sidebar />
      </div>

      {/* Conteúdo principal */}
      <main className="w-full mt-20 md:mt-28 px-4 overflow-x-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/disciplinas" element={<Subjects />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/conteudos" element={<Materials />} />
          <Route path="/denuncias" element={<Report />} />
          <Route path="/ajuda" element={<Help />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
