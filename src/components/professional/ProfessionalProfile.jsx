import { Star, Briefcase, MapPin, CreditCard, Edit3 } from 'lucide-react';
import { StarDisplay } from '../shared/StarRating';
import { useApp } from '../../store/AppContext';

const ACTIVE_PRO_ID = 'pro-1';

export default function ProfessionalProfile() {
  const { state } = useApp();
  const pro = state.professionals.find((p) => p.id === ACTIVE_PRO_ID);
  if (!pro) return null;

  const completedJobs = state.solicitudes.filter(
    (s) => s.assignedProfessionalId === pro.id && s.status === 'completado'
  );
  const ratings = completedJobs.filter((s) => s.rating);

  return (
    <div className="fade-in">
      <h2 className="font-bold text-xl text-slate-900 mb-6">Mi Perfil</h2>

      {/* Profile card */}
      <div className="card p-6 mb-4">
        <div className="flex items-start gap-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
            style={{ backgroundColor: pro.avatarColor }}
          >
            {pro.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-xl text-slate-900">{pro.name}</h3>
                <span className="inline-block mt-1 text-xs bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full font-semibold border border-primary-200">
                  {pro.category}
                </span>
              </div>
              <button className="btn-ghost !p-2 border border-slate-200">
                <Edit3 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1">
                <StarDisplay rating={pro.rating} size={16} />
                <span className="font-semibold text-slate-900 ml-1">{pro.rating}</span>
              </div>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="text-sm text-slate-500">{pro.jobsCompleted} trabajos completados</span>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-400">
              <MapPin size={13} />
              {pro.location}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card p-5 mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <Briefcase size={14} />Descripción profesional
        </h4>
        <p className="text-sm text-slate-600 leading-relaxed">{pro.description}</p>
      </div>

      {/* Payment methods */}
      <div className="card p-5 mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
          <CreditCard size={14} />Métodos de pago
        </h4>
        <div className="flex flex-wrap gap-2">
          {pro.paymentMethods.map((pm) => (
            <span key={pm} className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-medium">
              {pm}
            </span>
          ))}
        </div>
      </div>

      {/* Recent reviews */}
      <div className="card p-5">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
          <Star size={14} />Calificaciones recientes
        </h4>
        {ratings.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Todavía no tenés calificaciones.</p>
        ) : (
          <div className="space-y-3">
            {ratings.map((s) => (
              <div key={s.id} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-700 truncate">{s.title}</p>
                  <StarDisplay rating={s.rating} size={13} />
                </div>
                {s.ratingComment && (
                  <p className="text-xs text-slate-500">"{s.ratingComment}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
