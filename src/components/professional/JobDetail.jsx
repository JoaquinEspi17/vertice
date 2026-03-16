import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Image, Send, AlertCircle } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import SendQuoteModal from './SendQuoteModal';
import { useApp } from '../../store/AppContext';

const ACTIVE_PRO_ID = 'pro-active';

export default function JobDetail({ solicitudId, onBack }) {
  const { state } = useApp();
  const [showSendQuote, setShowSendQuote] = useState(false);

  const solicitud = state.solicitudes.find((s) => s.id === solicitudId);
  if (!solicitud) return null;

  const sentQuote = state.presupuestos.find(
    (p) => p.solicitudId === solicitudId && p.professionalId === ACTIVE_PRO_ID
  );
  const quotaFull = solicitud.presupuestosIds.length >= 3;
  const isNotAvailable = solicitud.status !== 'recibiendo_presupuestos';

  let disabledReason = null;
  if (sentQuote) disabledReason = 'Ya enviaste un presupuesto para esta solicitud.';
  else if (quotaFull) disabledReason = 'Esta solicitud ya alcanzó el máximo de 3 presupuestos.';
  else if (isNotAvailable) disabledReason = 'Esta solicitud ya no está disponible.';

  return (
    <div className="fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="btn-ghost !p-2 border border-slate-200">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-xl text-slate-900 truncate">{solicitud.title}</h2>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{solicitud.category}</span>
            <StatusBadge status={solicitud.status} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Info */}
        <div className="card p-4">
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary-400" />
              {solicitud.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary-400" />
              {solicitud.date}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Descripción del problema</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{solicitud.description}</p>
        </div>

        {/* Photos placeholder */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <Image size={14} />Fotos adjuntas
          </h3>
          <div className="flex gap-2">
            {solicitud.photos.length === 0 ? (
              <div className="w-full py-6 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                <p className="text-slate-300 text-sm">Sin fotos adjuntas</p>
              </div>
            ) : (
              solicitud.photos.map((p, i) => (
                <img key={i} src={p} alt="" className="w-20 h-20 object-cover rounded-lg border border-slate-100" />
              ))
            )}
          </div>
        </div>

        {/* Disabled reason */}
        {disabledReason && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {disabledReason}
          </div>
        )}

        {/* Already sent quote */}
        {sentQuote && (
          <div className="card p-4 border-l-4 border-primary-500">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Tu presupuesto</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-primary-600">${sentQuote.price.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{sentQuote.estimatedTime}</p>
              </div>
              <StatusBadge status={sentQuote.status} size="lg" />
            </div>
            {sentQuote.message && (
              <p className="text-sm text-slate-500 mt-2">"{sentQuote.message}"</p>
            )}
          </div>
        )}

        {/* CTA */}
        {!disabledReason && (
          <button
            onClick={() => setShowSendQuote(true)}
            className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 rounded-xl"
          >
            <Send size={18} />
            Enviar Presupuesto
          </button>
        )}
      </div>

      {showSendQuote && (
        <SendQuoteModal solicitud={solicitud} onClose={() => setShowSendQuote(false)} />
      )}
    </div>
  );
}
