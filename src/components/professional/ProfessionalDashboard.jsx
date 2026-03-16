import { useState } from 'react';
import {
  Briefcase, Send, CheckCircle, Package,
  MapPin, Calendar, ChevronRight, Clock, DollarSign, User
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import StatusBadge from '../shared/StatusBadge';
import { StarDisplay } from '../shared/StarRating';
import JobDetail from './JobDetail';
import ProfessionalProfile from './ProfessionalProfile';

const ACTIVE_PRO_ID = 'pro-1';
const ACTIVE_PRO_CATEGORY = 'Electricista';

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

export default function ProfessionalDashboard() {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState('available');
  const [viewingJobId, setViewingJobId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const pro = state.professionals.find((p) => p.id === ACTIVE_PRO_ID);

  // Available: matching category + open + not already sent by this pro
  const available = state.solicitudes.filter((s) => {
    const alreadySent = state.presupuestos.some(
      (p) => p.solicitudId === s.id && p.professionalId === ACTIVE_PRO_ID
    );
    return s.category === ACTIVE_PRO_CATEGORY && s.status === 'recibiendo_presupuestos' && !alreadySent;
  });

  // Sent quotes by this pro
  const myPresupuestos = state.presupuestos.filter((p) => p.professionalId === ACTIVE_PRO_ID);

  // Active jobs
  const activeJobs = state.solicitudes.filter(
    (s) => s.assignedProfessionalId === ACTIVE_PRO_ID && s.status === 'en_proceso'
  );

  const completedJobs = state.solicitudes.filter(
    (s) => s.assignedProfessionalId === ACTIVE_PRO_ID && s.status === 'completado'
  );

  const stats = {
    available: available.length,
    sent: myPresupuestos.length,
    active: activeJobs.length,
    completed: completedJobs.length,
  };

  if (showProfile) {
    return (
      <div>
        <button
          onClick={() => setShowProfile(false)}
          className="flex items-center gap-2 btn-ghost border border-slate-200 mb-6"
        >
          ← Volver al panel
        </button>
        <ProfessionalProfile />
      </div>
    );
  }

  if (viewingJobId) {
    return <JobDetail jobId={viewingJobId} solicitudId={viewingJobId} onBack={() => setViewingJobId(null)} />;
  }

  const tabs = [
    { id: 'available', label: 'Disponibles', count: stats.available },
    { id: 'sent', label: 'Mis Presupuestos', count: stats.sent },
    { id: 'active', label: 'En Proceso', count: stats.active },
  ];

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Hola, {pro?.name?.split(' ')[0]} 👷
          </h2>
          <p className="text-slate-500 mt-1">
            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-semibold border border-primary-200">
              {pro?.category}
            </span>
            <span className="ml-2 text-sm">
              ⭐ {pro?.rating} · {pro?.jobsCompleted} trabajos
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowProfile(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 hover:opacity-90 transition-opacity border-2 border-white shadow-md"
          style={{ backgroundColor: pro?.avatarColor }}
          title="Ver perfil"
        >
          {pro?.avatar}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Solicitudes disponibles" value={stats.available} icon={Briefcase} color="bg-blue-500" />
        <StatCard label="Presupuestos enviados" value={stats.sent} icon={Send} color="bg-amber-500" />
        <StatCard label="Trabajos aceptados" value={stats.active} icon={CheckCircle} color="bg-accent-500" />
        <StatCard label="Completados" value={stats.completed} icon={Package} color="bg-green-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                tab === t.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'available' && (
        <div className="space-y-3">
          {available.length === 0 ? (
            <div className="card p-12 text-center">
              <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">No hay solicitudes disponibles</p>
              <p className="text-slate-300 text-sm mt-1">Nuevas solicitudes aparecerán acá cuando los clientes publiquen.</p>
            </div>
          ) : (
            available.map((sol) => (
              <div
                key={sol.id}
                className="card p-4 hover:shadow-card-hover transition-all cursor-pointer group"
                onClick={() => setViewingJobId(sol.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase size={18} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-slate-900 truncate">{sol.title}</h4>
                      <ChevronRight size={18} className="text-slate-300 flex-shrink-0 group-hover:text-slate-500 transition-colors mt-0.5" />
                    </div>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{sol.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin size={10} />{sol.location}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={10} />{sol.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-400">
                        {sol.presupuestosIds.length}/3 presupuestos
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setViewingJobId(sol.id); }}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                      >
                        Ver solicitud →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'sent' && (
        <div className="space-y-3">
          {myPresupuestos.length === 0 ? (
            <div className="card p-12 text-center">
              <Send size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">No enviaste presupuestos aún</p>
              <p className="text-slate-300 text-sm mt-1">Cuando envíes un presupuesto, aparecerá acá.</p>
            </div>
          ) : (
            myPresupuestos.map((pres) => {
              const sol = state.solicitudes.find((s) => s.id === pres.solicitudId);
              return (
                <div key={pres.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">{sol?.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{sol?.category} · {sol?.location}</p>
                      {pres.message && (
                        <p className="text-sm text-slate-500 mt-1.5 line-clamp-2">"{pres.message}"</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <p className="text-lg font-bold text-primary-600">${pres.price.toLocaleString()}</p>
                      <StatusBadge status={pres.status} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === 'active' && (
        <div className="space-y-3">
          {activeJobs.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCircle size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">No hay trabajos en proceso</p>
              <p className="text-slate-300 text-sm mt-1">Cuando un cliente acepte tu presupuesto, el trabajo aparecerá acá.</p>
            </div>
          ) : (
            activeJobs.map((sol) => (
              <div key={sol.id} className="card p-4 border-l-4 border-accent-500">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle size={14} className="text-accent-500 flex-shrink-0" />
                      <p className="font-semibold text-slate-900 truncate">{sol.title}</p>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{sol.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin size={10} />{sol.location}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status="en_proceso" />
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => dispatch({ type: 'COMPLETE_JOB', payload: { solicitudId: sol.id } })}
                    className="btn-primary text-xs w-full"
                  >
                    Marcar como completado
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
