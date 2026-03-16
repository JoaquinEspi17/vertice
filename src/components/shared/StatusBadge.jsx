const STATUS_CONFIG = {
  recibiendo_presupuestos: {
    label: 'Recibiendo presupuestos',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  en_proceso: {
    label: 'En proceso',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  completado: {
    label: 'Completado',
    classes: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  pendiente: {
    label: 'Esperando respuesta',
    classes: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
  aceptado: {
    label: 'Aceptado',
    classes: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  rechazado: {
    label: 'Rechazado',
    classes: 'bg-red-50 text-red-600 border-red-200',
    dot: 'bg-red-400',
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    classes: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  };
  const padding = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.classes} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
