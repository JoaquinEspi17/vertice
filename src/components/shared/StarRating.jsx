import { Star } from 'lucide-react';

export function StarDisplay({ rating, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}
          fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

export function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={32}
            className={i <= value ? 'text-amber-400' : 'text-slate-200'}
            fill={i <= value ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
}
