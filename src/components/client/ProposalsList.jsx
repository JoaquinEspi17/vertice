import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Users, Clock, DollarSign } from 'lucide-react';
import { StarDisplay } from '../shared/StarRating';
import StatusBadge from '../shared/StatusBadge';
import RatingModal from './RatingModal';
import { useApp } from '../../store/AppContext';

export default function ProposalsList({ solicitudId, onBack }) {
  const { state, dispatch } = useApp();
  const [showRating, setShowRating] = useState(false);
  const [choosingId, setChoosingId] = useState(null);
  const [chosen, setChosen] = useState(false);

  const solicitud = state.solicitudes.find((s) => s.id === solicitudId);
  if (!solicitud) return null;

  const presupuestos = state.presupuestos.filter((p) => solicitud.presupuestosIds.includes(p.id));
  const canChoose = solicitud.status === 'recibiendo_presupuestos';

  function handleChoose(presupuesto) {
    setChoosingId(presupuesto.id);
    dispatch({
      type: 'CHOOSE_PROFESSIONAL',
      payload: { solicitudId: solicitud.id, professionalId: presupuesto.professionalId },
    });
    setChosen(true);
    setTimeout(() => setChoosingId(null), 800);
  }

  const assignedPro = solicitud.assignedProfessionalId
    ? state.professionals.find((p) => p.id === solicitud.assignedProfessionalId)
    : null;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="btn-ghost !p-2 border border-slate-200">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-xl text-slate-900 truncate">{solicitud.title}</h2>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <StatusBadge status={solicitud.status} />
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin size={11} />{solicitud.location}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar size={11} />{solicitud.date}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card p-4 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Descripción del problema</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{solicitud.description}</p>
      </div>

      {/* Assigned professional (en_proceso) */}
      {solicitud.status === 'en_proceso' && assignedPro && (
        <div className="card p-4 mb-6 border-l-4 border-accent-500">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-accent-500" />
            <h3 className="text-sm font-semibold text-slate-700">Profesional asignado</h3>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: assignedPro.avatarColor }}
            >
              {assignedPro.avatar}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{assignedPro.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StarDisplay rating={assignedPro.rating} size={12} />
                <span className="text-xs text-slate-500">{assignedPro.rating} · {assignedPro.jobsCompleted} trabajos</span>
              </div>
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'COMPLETE_JOB', payload: { solicitudId: solicitud.id } });
              }}
              className="btn-primary text-xs"
            >
              Marcar como completado
            </button>
          </div>
        </div>
      )}

      {/* Rate (completado) */}
      {solicitud.status === 'completado' && !solicitud.rating && (
        <div className="card p-4 mb-6 bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-800 font-medium mb-3">¡Trabajo finalizado! ¿Querés calificar al profesional?</p>
          <button onClick={() => setShowRating(true)} className="btn-primary text-sm">
            Dejar calificación
          </button>
        </div>
      )}

      {solicitud.status === 'completado' && solicitud.rating && (
        <div className="card p-4 mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-sm text-green-800 font-semibold">Calificación enviada</p>
          </div>
          <StarDisplay rating={solicitud.rating} size={16} />
          {solicitud.ratingComment && <p className="text-sm text-green-700 mt-1.5">"{solicitud.ratingComment}"</p>}
        </div>
      )}

      {/* Proposals */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-slate-400" />
          <h3 className="font-semibold text-slate-700">
            Presupuestos recibidos
            <span className="ml-2 text-sm font-normal text-slate-400">({presupuestos.length}/3)</span>
          </h3>
        </div>

        {presupuestos.length === 0 ? (
          <div className="card p-8 text-center">
            <Users size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">Aún no hay presupuestos.</p>
            <p className="text-slate-300 text-xs mt-1">Los profesionales de tu zona verán tu solicitud pronto.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {presupuestos.map((pres) => {
              const pro = state.professionals.find((p) => p.id === pres.professionalId);
              if (!pro) return null;
              const isChosen = choosingId === pres.id || solicitud.assignedProfessionalId === pro.id;
              return (
                <div key={pres.id} className={`card p-4 transition-all ${isChosen && solicitud.status === 'en_proceso' ? 'border-accent-400 ring-2 ring-accent-200' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: pro.avatarColor }}
                    >
                      {pro.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-slate-900">{pro.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <StarDisplay rating={pro.rating} size={12} />
                            <span className="text-xs text-slate-500">{pro.rating} · {pro.jobsCompleted} trabajos</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-primary-600">${pres.price.toLocaleString()}</p>
                          <p className="text-xs text-slate-400 flex items-center justify-end gap-1">
                            <Clock size={10} />{pres.estimatedTime}
                          </p>
                        </div>
                      </div>

                      {pres.message && (
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">"{pres.message}"</p>
                      )}

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <StatusBadge status={pres.status} />
                        {canChoose && (
                          <button
                            onClick={() => handleChoose(pres)}
                            className="btn-primary text-xs"
                          >
                            Elegir profesional
                          </button>
                        )}
                        {isChosen && solicitud.status === 'en_proceso' && (
                          <span className="flex items-center gap-1 text-accent-600 text-xs font-semibold">
                            <CheckCircle size={14} /> Seleccionado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showRating && (
        <RatingModal solicitud={solicitud} onClose={() => setShowRating(false)} />
      )}
    </div>
  );
}
