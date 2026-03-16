import { useState } from 'react';
import {
  Plus, FileText, CheckCircle, Loader, Package,
  ChevronRight, MapPin, Calendar, MessageSquare
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import StatusBadge from '../shared/StatusBadge';
import NewRequestModal from './NewRequestModal';
import ProposalsList from './ProposalsList';

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-400 leading-tight">{label}</p>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { state } = useApp();
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [viewingSolicitudId, setViewingSolicitudId] = useState(null);

  const mySolicitudes = state.solicitudes.filter((s) => s.clientId === 'client-1');
  const stats = {
    abiertas: mySolicitudes.filter((s) => s.status === 'recibiendo_presupuestos').length,
    enProceso: mySolicitudes.filter((s) => s.status === 'en_proceso').length,
    completadas: mySolicitudes.filter((s) => s.status === 'completado').length,
    total: mySolicitudes.length,
  };

  if (viewingSolicitudId) {
    return <ProposalsList solicitudId={viewingSolicitudId} onBack={() => setViewingSolicitudId(null)} />;
  }

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Hola, Carlos 👋</h2>
        <p className="text-slate-500 mt-1">Gestioná tus solicitudes y presupuestos desde acá.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Solicitudes abiertas" value={stats.abiertas} icon={FileText} color="bg-blue-500" />
        <StatCard label="En proceso" value={stats.enProceso} icon={Loader} color="bg-amber-500" />
        <StatCard label="Completadas" value={stats.completadas} icon={CheckCircle} color="bg-green-500" />
        <StatCard label="Total solicitudes" value={stats.total} icon={Package} color="bg-primary-600" />
      </div>

      {/* CTA */}
      <button
        onClick={() => setShowNewRequest(true)}
        className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 mb-8 rounded-xl"
      >
        <Plus size={20} />
        Nueva Solicitud
      </button>

      {/* My Requests */}
      <div>
        <h3 className="font-bold text-lg text-slate-900 mb-4">Mis Solicitudes</h3>

        {mySolicitudes.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">Todavía no tenés solicitudes</p>
            <p className="text-slate-300 text-sm mt-1">Creá tu primera solicitud para empezar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mySolicitudes.map((sol) => {
              const presCount = sol.presupuestosIds.length;
              return (
                <div
                  key={sol.id}
                  className="card p-4 hover:shadow-card-hover transition-all cursor-pointer group"
                  onClick={() => setViewingSolicitudId(sol.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 truncate">{sol.title}</h4>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                              {sol.category}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar size={10} />{sol.date}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin size={10} />{sol.location}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 flex-shrink-0 group-hover:text-slate-500 transition-colors mt-1" />
                      </div>

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <StatusBadge status={sol.status} />
                        <div className="flex items-center gap-3">
                          {presCount > 0 && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <MessageSquare size={12} />
                              {presCount} presupuesto{presCount !== 1 ? 's' : ''}
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); setViewingSolicitudId(sol.id); }}
                            className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                          >
                            Ver presupuestos →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showNewRequest && <NewRequestModal onClose={() => setShowNewRequest(false)} />}
    </div>
  );
}
