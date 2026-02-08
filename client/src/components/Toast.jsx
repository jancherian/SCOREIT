import { Toaster } from 'react-hot-toast';

function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '12px',
          padding: '10px 14px',
          background: '#111216',
          color: '#ffffff',
        },
        success: {
          style: {
            background: '#16a34a',
            color: '#ffffff',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        },
      }}
    />
  );
}

export default Toast;
