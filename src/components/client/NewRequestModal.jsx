import { useState } from 'react';
import { X, Upload, MapPin, Briefcase, FileText, AlignLeft } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../store/AppContext';

export default function NewRequestModal({ onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.category) e.category = 'Seleccioná el tipo de profesional';
    if (!form.title.trim()) e.title = 'Ingresá un título';
    if (!form.description.trim()) e.description = 'Describí el problema';
    if (!form.location.trim()) e.location = 'Ingresá tu ubicación';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    dispatch({ type: 'ADD_SOLICITUD', payload: form });
    setSubmitted(true);
    setTimeout(onClose, 1600);
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Nueva Solicitud</h2>
            <p className="text-xs text-slate-400 mt-0.5">Completá los datos para recibir presupuestos</p>
          </div>
          <button onClick={onClose} className="btn-ghost !p-2">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-16 flex flex-col items-center gap-3 fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">¡Solicitud publicada!</h3>
            <p className="text-slate-500 text-sm text-center px-8">
              Los profesionales de tu zona ya pueden ver tu solicitud y enviar presupuestos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Category */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5"><Briefcase size={14} />Tipo de profesional</span>
              </label>
              <select
                className={`input ${errors.category ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                value={form.category}
                onChange={(e) => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: null }); }}
              >
                <option value="">Seleccioná una categoría...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5"><FileText size={14} />Título del problema</span>
              </label>
              <input
                className={`input ${errors.title ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                placeholder="Ej: Corte de luz en cocina"
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: null }); }}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5"><AlignLeft size={14} />Descripción detallada</span>
              </label>
              <textarea
                className={`input resize-none h-28 ${errors.description ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                placeholder="Describí el problema con el mayor detalle posible..."
                value={form.description}
                onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: null }); }}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5"><MapPin size={14} />Ubicación</span>
              </label>
              <input
                className={`input ${errors.location ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                placeholder="Ej: Palermo, CABA"
                value={form.location}
                onChange={(e) => { setForm({ ...form, location: e.target.value }); setErrors({ ...errors, location: null }); }}
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>

            {/* Photos */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5"><Upload size={14} />Fotos (opcional)</span>
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-5 text-center hover:border-primary-300 transition-colors cursor-pointer hover:bg-slate-50">
                <Upload size={20} className="mx-auto text-slate-300 mb-1.5" />
                <p className="text-sm text-slate-400">Arrastrá fotos o hacé clic para subir</p>
                <p className="text-xs text-slate-300 mt-0.5">PNG, JPG hasta 10MB</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1 pb-1">
              <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-slate-200">
                Cancelar
              </button>
              <button type="submit" className="btn-primary flex-1">
                Publicar Solicitud
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
