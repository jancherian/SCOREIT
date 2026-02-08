import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home.jsx';
import Display from './pages/Display.jsx';
import Control from './pages/Control.jsx';
import History from './pages/History.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Toast from './components/Toast.jsx';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/display" element={<PageWrapper><Display /></PageWrapper>} />
        <Route path="/control" element={<PageWrapper><Control /></PageWrapper>} />
        <Route path="/history" element={<PageWrapper><History /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <BrowserRouter>
          <Toast />
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
