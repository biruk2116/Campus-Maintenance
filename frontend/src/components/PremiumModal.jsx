import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

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
    if (!isOpen) return null;

    const iconMap = {
        danger: <AlertTriangle size={24} className="text-danger" />,
        success: <CheckCircle size={24} className="text-success" />,
        default: <Info size={24} className="text-primary" />
    };

    return (
        <div className="modal-backdrop-custom" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`premium-modal-window premium-card p-4 p-md-5 bg-glass border-secondary border-opacity-10 shadow-22xl text-main ${dialogClassName}`.trim()}
                style={{ width: '100%', maxWidth, ...dialogStyle }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
                    <div className="d-flex align-items-center gap-3">
                        <div className={`bg-${type === 'default' ? 'primary' : type} bg-opacity-10 p-3 rounded-4 shadow-sm`}>
                            {iconMap[type]}
                        </div>
                        <h4 className="fw-800 mb-0 tracking-tighter">{title}</h4>
                    </div>
                    <button onClick={onClose} className="btn btn-surface btn-sm p-2 rounded-circle border-0">
                        <X size={20} />
                    </button>
                </div>

                <div className={`modal-body premium-modal-body ${showFooter ? 'mb-4' : ''} ${bodyClassName}`.trim()}>
                    {children}
                </div>

                {showFooter && (
                    <div className="d-flex gap-3 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="btn btn-surface px-4 py-3 rounded-pill fw-800 uppercase smallest tracking-widest flex-grow-1 border-secondary border-opacity-10"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`btn btn-${type === 'danger' ? 'danger' : 'primary'} px-4 py-3 rounded-pill fw-800 uppercase smallest tracking-widest flex-grow-1 shadow-22xl`}
                        >
                            {confirmText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PremiumModal;
