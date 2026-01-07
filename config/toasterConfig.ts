import { ToasterProps } from 'react-hot-toast';

const toasterConfig: ToasterProps = {
    position: 'bottom-right',
    reverseOrder: false,
    gutter: 8,
    toastOptions: {
        // Default options for all toasts
        duration: 15000,
        style: {
            background: '#1f2937',
            color: '#f9fafb',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
        },

        // Success toast styling
        success: {
            duration: 3000,
            style: {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            iconTheme: {
                primary: '#ffffff',
                secondary: '#10b981',
            },
        },

        // Error toast styling
        error: {
            duration: 4500,
            style: {
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            iconTheme: {
                primary: '#ffffff',
                secondary: '#ef4444',
            },
        },

        // Loading toast styling
        loading: {
            style: {
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            iconTheme: {
                primary: '#ffffff',
                secondary: '#3b82f6',
            },
        },
    },
};

export default toasterConfig;
