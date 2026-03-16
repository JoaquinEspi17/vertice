import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { StarPicker } from '../shared/StarRating';
import { useApp } from '../../store/AppContext';

export default function RatingModal({ solicitud, onClose }) {
  const { state, dispatch } = useApp();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const prof = state.professionals.find((p) => p.id === solicitud.assignedProfessionalId);

  function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    dispatch({
      type: 'RATE_PROFESSIONAL',
      payload: { solicitudId: solicitud.id, rating, comment },
    });
    setSubmitted(true);
    setTimeout(onClose, 1600);
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-900">Calificar trabajo</h2>
          <button onClick={onClose} className="btn-ghost !p-2"><X size={18} /></button>
        </div>

        {submitted ? (
          <div className="py-14 flex flex-col items-center gap-3 fade-in">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Star size={28} className="text-amber-400" fill="currentColor" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">¡Gracias por tu calificación!</h3>
            <p className="text-slate-500 text-sm text-center">Tu opinión ayuda a mejorar la comunidad.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {prof && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: prof.avatarColor }}
                >
                  {prof.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{prof.name}</p>
                  <p className="text-sm text-slate-500">{prof.category}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">¿Cómo calificás el trabajo?</p>
              <StarPicker value={rating} onChange={setRating} />
              {rating > 0 && (
                <p className="text-xs text-slate-400 mt-1.5">
                  {['', 'Muy malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'][rating]}
                </p>
              )}
            </div>

            <div>
              <label className="label">Comentario (opcional)</label>
              <textarea
                className="input resize-none h-24"
                placeholder="Contá tu experiencia con el profesional..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-slate-200">
                Cancelar
              </button>
              <button type="submit" disabled={!rating} className={`flex-1 btn-primary ${!rating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Enviar Calificación
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
