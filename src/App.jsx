import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import MissionGallery from './pages/MissionGallery';
import TeamStory from './pages/TeamStory';
import TogetherMoments from './pages/TogetherMoments';
import Slideshow from './pages/Slideshow';

// Wrapper for AnimatePresence to work with routing
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<MissionGallery />} />
        <Route path="/gallery/:teamId" element={<TeamStory />} />
        <Route path="/moments" element={<TogetherMoments />} />
        <Route path="/slideshow" element={<Slideshow />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="page-transition">
          <AnimatedRoutes />
        </main>
        <footer style={{ 
          textAlign: 'center', 
          padding: '30px 20px', 
          backgroundColor: 'var(--background-light)', 
          color: 'var(--text-muted)', 
          fontSize: '0.9rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <p>copyright 성덕교회. 서울특별시 동대문구 사가정로15길 27, (전농동) TEL : 02-2245-4795</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
