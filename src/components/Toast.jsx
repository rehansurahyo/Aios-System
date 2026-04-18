import React, { useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { ToastContext } from '../context/ToastContext';

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-slide-in
                            ${toast.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : ''}
                            ${toast.type === 'info' ? 'bg-sky-500/90 text-white border-sky-400' : ''}
                            dark:bg-opacity-90 min-w-[300px]
                        `}
                    >
                        <div className="text-xl">
                            {toast.type === 'success' && <FiCheckCircle />}
                            {toast.type === 'error' && <FiAlertCircle />}
                            {toast.type === 'info' && <FiInfo />}
                        </div>
                        <p className="font-medium text-sm flex-1">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <FiX />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
