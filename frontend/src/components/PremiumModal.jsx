import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const PremiumModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    type = 'default', // 'default', 'danger', 'success'
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    showFooter = true,
    maxWidth = '500px',
    dialogClassName = '',
    bodyClassName = '',
    dialogStyle = {}
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const iconMap = {
        danger: <AlertTriangle size={24} className="text-danger" />,
        success: <CheckCircle size={24} className="text-success" />,
        default: <Info size={24} className="text-primary" />
    };

    const typeBgMap = {
        danger: 'bg-danger/10 text-danger',
        success: 'bg-success/10 text-success',
        default: 'bg-primary/10 text-primary'
    };

    const typeBtnMap = {
        danger: 'bg-danger text-white hover:bg-red-600',
        success: 'bg-success text-white hover:bg-emerald-600',
        default: 'btn-primary'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-start justify-center p-6 overflow-y-auto sm:items-center">
                    {/* Backdrop */}
                    <Motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '100%', maxWidth, ...dialogStyle }}
                        className={`relative z-10 flex flex-col glass-card p-6 sm:p-8 my-auto overflow-hidden ${dialogClassName}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${typeBgMap[type]}`}>
                                    {iconMap[type]}
                                </div>
                                <h4 className="text-xl font-extrabold m-0 text-textPrimary tracking-tight">{title}</h4>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 rounded-full hover:bg-white/10 text-textSecondary hover:text-textPrimary transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className={`flex-1 overflow-y-auto pr-2 custom-scrollbar ${showFooter ? 'mb-6' : ''} ${bodyClassName}`}>
                            {children}
                        </div>

                        {/* Footer */}
                        {showFooter && (
                            <div className="flex gap-4 shrink-0">
                                <button
                                    onClick={onClose}
                                    className="btn-secondary flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-wider"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 ${typeBtnMap[type]} shadow-lg`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        )}
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PremiumModal;
