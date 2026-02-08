import { createContext, useContext } from 'react';
import { useSocket } from '../hooks/useSocket.js';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketValue = useSocket();

  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  );
}

export function useMatchContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useMatchContext must be used within SocketProvider');
  }
  return ctx;
}

