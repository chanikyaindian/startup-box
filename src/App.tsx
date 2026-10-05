import { useEffect } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Brand, OrbitArt, StarfieldBackground, Toast } from './components';
import { useApp } from './store/useApp';
import { StudioHome, StudioExplore, StudioLogin } from './screens/Studio';
import { StudioRoom } from './screens/CrewRoom';
import { StudioLaunch } from './screens/Launch';
import { StudioGraduation, StudioInactivity, StudioSettings, StudioSprintEnd } from './screens/Finish';
import { StudioMatching, StudioOnboarding, StudioProfile } from './screens/Journey';

function Guard({ children }: { children: React.ReactNode }) {
  const loggedIn = useApp(s => s.loggedIn);
  return loggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}
function Splash() {
  const nav = useNavigate(); const loggedIn = useApp(s => s.loggedIn); const onboarded = useApp(s => s.onboardingComplete);
  useEffect(() => { const timer = setTimeout(() => nav(loggedIn ? onboarded ? '/home' : '/onboarding' : '/login', { replace: true }), 1500); return () => clearTimeout(timer); }, [nav, loggedIn, onboarded]);
  return <div className="splash"><StarfieldBackground dense /><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="studio-splash"><OrbitArt /><Brand /><p>Different minds. Shared possibility.</p><div className="loader" /></motion.div></div>;
}
export default function App() {
  const toast = useApp(s => s.toast); const setToast = useApp(s => s.setToast);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(null), 3800); return () => clearTimeout(timer); }, [toast, setToast]);
  return <MotionConfig reducedMotion="user"><Routes>
    <Route path="/" element={<Splash />} />
    <Route path="/login" element={<StudioLogin />} />
    <Route path="/onboarding" element={<Guard><StudioOnboarding /></Guard>} />
    <Route path="/matching" element={<Guard><StudioMatching /></Guard>} />
    <Route path="/launch/:boxId" element={<Guard><StudioLaunch /></Guard>} />
    <Route path="/home" element={<Guard><StudioHome /></Guard>} />
    <Route path="/explore" element={<Guard><StudioExplore /></Guard>} />
    <Route path="/box/:boxId" element={<Guard><StudioRoom /></Guard>} />
    <Route path="/sprint/:boxId/end" element={<Guard><StudioSprintEnd /></Guard>} />
    <Route path="/graduation/:boxId" element={<Guard><StudioGraduation /></Guard>} />
    <Route path="/profile" element={<Guard><StudioProfile /></Guard>} />
    <Route path="/settings" element={<Guard><StudioSettings /></Guard>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes><StudioInactivity />{toast && <Toast message={toast} onClose={() => setToast(null)} />}</MotionConfig>;
}
