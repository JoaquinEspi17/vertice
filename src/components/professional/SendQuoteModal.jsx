import { useState } from 'react';
import { X, DollarSign, Clock, MessageSquare } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export default function SendQuoteModal({ solicitud, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({ price: '', estimatedTime: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Ingresá un precio válido';
    if (!form.estimatedTime.trim()) e.estimatedTime = 'Indicá el tiempo estimado';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    dispatch({
      type: 'ADD_PRESUPUESTO',
      payload: {
        solicitudId: solicitud.id,
        professionalId: 'pro-active',
        price: Number(form.price),
        estimatedTime: form.estimatedTime,
        message: form.message,
      },
    });
    setSubmitted(true);
    setTimeout(onClose, 1600);
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Enviar presupuesto</h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">{solicitud.title}</p>
          </div>
          <button onClick={onClose} className="btn-ghost !p-2"><X size={18} /></button>
        </div>

        {submitted ? (
          <div className="py-14 flex flex-col items-center gap-3 fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">¡Presupuesto enviado!</h3>
            <p className="text-slate-500 text-sm text-center px-8">
              El cliente recibirá una notificación y podrá elegirte.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5"><DollarSign size={14} />Precio ofrecido</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  className={`input pl-7 ${errors.price ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                  placeholder="Ej: 7500"
                  value={form.price}
                  onChange={(e) => { setForm({ ...form, price: e.target.value }); setErrors({ ...errors, price: null }); }}
                />
              </div>
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="label">
                <span className="flex items-center gap-1.5"><Clock size={14} />Tiempo estimado</span>
              </label>
              <input
                className={`input ${errors.estimatedTime ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                placeholder="Ej: 2-3 horas, 1 día"
                value={form.estimatedTime}
                onChange={(e) => { setForm({ ...form, estimatedTime: e.target.value }); setErrors({ ...errors, estimatedTime: null }); }}
              />
              {errors.estimatedTime && <p className="text-xs text-red-500 mt-1">{errors.estimatedTime}</p>}
            </div>

            <div>
              <label className="label">
                <span className="flex items-center gap-1.5"><MessageSquare size={14} />Mensaje al cliente (opcional)</span>
              </label>
              <textarea
                className="input resize-none h-24"
                placeholder="Presentate y explicá cómo vas a resolver el problema..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-slate-200">
                Cancelar
              </button>
              <button type="submit" className="btn-primary flex-1">
                Enviar Presupuesto
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
