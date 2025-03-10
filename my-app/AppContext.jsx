import React, { createContext, useReducer, useContext } from 'react';

// Initial State
const initialState = {
    user: null,
    isAuthenticated: false,
    theme: 'light',
    language: 'en',
    notifications: [],
    kpis: {
        gdpGrowth: null,
        jobCreation: null,
        foreignInvestment: null
    }
};

// Action Types
const ACTION_TYPES = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    UPDATE_KPIs: 'UPDATE_KPIs',
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
    TOGGLE_THEME: 'TOGGLE_THEME'
};

// Reducer
function appReducer(state, action) {
    switch (action.type) {
        case ACTION_TYPES.LOGIN:
            return { ...state, user: action.payload, isAuthenticated: true };
        case ACTION_TYPES.LOGOUT:
            return { ...state, user: null, isAuthenticated: false };
        case ACTION_TYPES.UPDATE_KPIs:
            return { ...state, kpis: { ...state.kpis, ...action.payload } };
        case ACTION_TYPES.ADD_NOTIFICATION:
            return { 
                ...state, 
                notifications: [...state.notifications, action.payload] 
            };
        case ACTION_TYPES.CHANGE_LANGUAGE:
            return { ...state, language: action.payload };
        case ACTION_TYPES.TOGGLE_THEME:
            return { 
                ...state, 
                theme: state.theme === 'light' ? 'dark' : 'light' 
            };
        default:
            return state;
    }
}

// Context Creation
const AppContext = createContext();

// Provider Component
export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Authentication Service
    const authService = {
        login: async (credentials) => {
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(credentials)
                });
                const user = await response.json();
                dispatch({ type: ACTION_TYPES.LOGIN, payload: user });
                return user;
            } catch (error) {
                console.error('Login failed', error);
                throw error;
            }
        },
        logout: () => {
            dispatch({ type: ACTION_TYPES.LOGOUT });
        }
    };

    // KPI Service
    const kpiService = {
        fetchLiveKPIs: async () => {
            try {
                const response = await fetch('/api/kpis');
                const kpis = await response.json();
                dispatch({ 
                    type: ACTION_TYPES.UPDATE_KPIs, 
                    payload: kpis 
                });
            } catch (error) {
                console.error('Failed to fetch KPIs', error);
            }
        }
    };

    // Notification Service
    const notificationService = {
        add: (notification) => {
            dispatch({ 
                type: ACTION_TYPES.ADD_NOTIFICATION, 
                payload: notification 
            });
        }
    };

    return (
        <AppContext.Provider 
            value={{ 
                state, 
                dispatch, 
                authService,
                kpiService,
                notificationService
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

// Custom Hook for using Context
export function useAppContext() {
    return useContext(AppContext);
}