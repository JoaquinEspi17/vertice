import { useState } from 'react';
import { AppProvider } from './store/AppContext';
import ClientDashboard from './components/client/ClientDashboard';
import ProfessionalDashboard from './components/professional/ProfessionalDashboard';
import NotificationBell from './components/shared/NotificationBell';
import { User, Wrench, Zap } from 'lucide-react';

function Header({ activeView, setActiveView }) {
  return (
    <header className="bg-primary-600 shadow-lg sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Brand */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" fill="currentColor" />
            </div>
            <span className="text-white font-black text-xl tracking-tight">Vertice</span>
          </div>
          <NotificationBell view={activeView === 'client' ? 'client' : 'professional'} />
        </div>

        {/* View toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('client')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
              activeView === 'client'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'bg-primary-700/50 text-white/80 hover:bg-primary-700/70'
            }`}
          >
            <User size={15} />
            Vista Cliente
          </button>
          <button
            onClick={() => setActiveView('professional')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
              activeView === 'professional'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'bg-primary-700/50 text-white/80 hover:bg-primary-700/70'
            }`}
          >
            <Wrench size={15} />
            Vista Profesional
          </button>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [activeView, setActiveView] = useState('client');

  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50">
        <Header activeView={activeView} setActiveView={setActiveView} />
        <main className="max-w-2xl mx-auto px-4 py-6">
          {activeView === 'client' ? <ClientDashboard /> : <ProfessionalDashboard />}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
