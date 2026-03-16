import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export default function NotificationBell({ view }) {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const notifications = state.notifications[view] ?? [];
  const unread = notifications.filter((n) => !n.read).length;

  function handleOpen() {
    setOpen((v) => !v);
    if (!open && unread > 0) {
      dispatch({ type: 'MARK_NOTIFICATIONS_READ', payload: { view } });
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell size={20} className="text-white" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 fade-in overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">Notificaciones</h3>
            <button onClick={() => setOpen(false)} className="btn-ghost !p-1">
              <X size={16} />
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <Bell size={28} className="mx-auto mb-2 opacity-30" />
              Sin notificaciones
            </div>
          ) : (
            <ul className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                  <p className="text-sm text-slate-700">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
