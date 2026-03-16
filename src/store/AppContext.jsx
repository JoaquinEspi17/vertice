import { createContext, useContext, useReducer } from 'react';
import {
  PROFESSIONALS,
  INITIAL_SOLICITUDES,
  INITIAL_PRESUPUESTOS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const AppContext = createContext(null);

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function recalcRating(professionalId, presupuestos, solicitudes) {
  const completedSols = solicitudes.filter(
    (s) => s.assignedProfessionalId === professionalId && s.status === 'completado' && s.rating
  );
  if (!completedSols.length) return null;
  const sum = completedSols.reduce((acc, s) => acc + s.rating, 0);
  return Math.round((sum / completedSols.length) * 10) / 10;
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_SOLICITUD': {
      const newSol = {
        id: generateId('sol'),
        clientId: 'client-1',
        title: action.payload.title,
        category: action.payload.category,
        description: action.payload.description,
        location: action.payload.location,
        date: new Date().toISOString().slice(0, 10),
        status: 'recibiendo_presupuestos',
        photos: [],
        presupuestosIds: [],
        assignedProfessionalId: null,
      };
      return {
        ...state,
        solicitudes: [newSol, ...state.solicitudes],
        notifications: {
          ...state.notifications,
          professional: [
            {
              id: generateId('n'),
              message: `Nueva solicitud disponible: "${newSol.title}" (${newSol.category})`,
              time: 'Ahora',
              read: false,
            },
            ...state.notifications.professional,
          ],
        },
      };
    }

    case 'ADD_PRESUPUESTO': {
      const { solicitudId, professionalId, price, estimatedTime, message } = action.payload;
      const sol = state.solicitudes.find((s) => s.id === solicitudId);
      if (!sol || sol.presupuestosIds.length >= 3) return state;

      const newPres = {
        id: generateId('pres'),
        solicitudId,
        professionalId,
        price,
        estimatedTime,
        message,
        status: 'pendiente',
        date: new Date().toISOString().slice(0, 10),
      };

      const updatedSolicitudes = state.solicitudes.map((s) => {
        if (s.id !== solicitudId) return s;
        const newIds = [...s.presupuestosIds, newPres.id];
        return { ...s, presupuestosIds: newIds };
      });

      const prof = state.professionals.find((p) => p.id === professionalId);
      return {
        ...state,
        solicitudes: updatedSolicitudes,
        presupuestos: [...state.presupuestos, newPres],
        notifications: {
          ...state.notifications,
          client: [
            {
              id: generateId('n'),
              message: `${prof?.name} envió un presupuesto para "${sol.title}"`,
              time: 'Ahora',
              read: false,
            },
            ...state.notifications.client,
          ],
        },
      };
    }

    case 'CHOOSE_PROFESSIONAL': {
      const { solicitudId, professionalId } = action.payload;
      const updatedSolicitudes = state.solicitudes.map((s) => {
        if (s.id !== solicitudId) return s;
        return { ...s, status: 'en_proceso', assignedProfessionalId: professionalId };
      });
      const updatedPresupuestos = state.presupuestos.map((p) => {
        if (p.solicitudId !== solicitudId) return p;
        return { ...p, status: p.professionalId === professionalId ? 'aceptado' : 'rechazado' };
      });
      const sol = state.solicitudes.find((s) => s.id === solicitudId);
      const prof = state.professionals.find((p) => p.id === professionalId);
      return {
        ...state,
        solicitudes: updatedSolicitudes,
        presupuestos: updatedPresupuestos,
        notifications: {
          ...state.notifications,
          professional: [
            {
              id: generateId('n'),
              message: `¡Tu presupuesto para "${sol?.title}" fue aceptado!`,
              time: 'Ahora',
              read: false,
            },
            ...state.notifications.professional,
          ],
          client: [
            {
              id: generateId('n'),
              message: `Asignaste el trabajo a ${prof?.name}. El trabajo está en proceso.`,
              time: 'Ahora',
              read: false,
            },
            ...state.notifications.client,
          ],
        },
      };
    }

    case 'COMPLETE_JOB': {
      const { solicitudId } = action.payload;
      const updatedSolicitudes = state.solicitudes.map((s) => {
        if (s.id !== solicitudId) return s;
        return { ...s, status: 'completado' };
      });
      return { ...state, solicitudes: updatedSolicitudes };
    }

    case 'RATE_PROFESSIONAL': {
      const { solicitudId, rating, comment } = action.payload;
      const updatedSolicitudes = state.solicitudes.map((s) => {
        if (s.id !== solicitudId) return s;
        return { ...s, rating, ratingComment: comment };
      });
      const sol = state.solicitudes.find((s) => s.id === solicitudId);
      const newRating = recalcRating(sol?.assignedProfessionalId, state.presupuestos, updatedSolicitudes);
      const updatedProfessionals = state.professionals.map((p) => {
        if (p.id !== sol?.assignedProfessionalId) return p;
        return {
          ...p,
          rating: newRating ?? p.rating,
          jobsCompleted: p.jobsCompleted + 1,
        };
      });
      return {
        ...state,
        solicitudes: updatedSolicitudes,
        professionals: updatedProfessionals,
      };
    }

    case 'MARK_NOTIFICATIONS_READ': {
      const { view } = action.payload;
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [view]: state.notifications[view].map((n) => ({ ...n, read: true })),
        },
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    solicitudes: INITIAL_SOLICITUDES,
    presupuestos: INITIAL_PRESUPUESTOS,
    professionals: PROFESSIONALS,
    notifications: INITIAL_NOTIFICATIONS,
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
