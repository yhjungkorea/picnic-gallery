import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamsData } from '../hooks/useTeamsData';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

// eventPhotos mock from TogetherMoments for slideshow
const eventPhotos = [
  'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=800'
];

const Slideshow = () => {
  const { teams, loading } = useTeamsData();
  const [allPhotos, setAllPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      let photos = [...eventPhotos];
      teams.forEach(team => {
        if (team.photos) {
          Object.values(team.photos).forEach(url => {
            if (url) photos.push(url);
          });
        }
      });
      // Shuffle photos for better slideshow experience
      photos = photos.sort(() => Math.random() - 0.5);
      setAllPhotos(photos);
    }
  }, [teams, loading]);

  useEffect(() => {
    let interval;
    if (isPlaying && allPhotos.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, allPhotos]);

  // Preload next image to improve loading speed
  useEffect(() => {
    if (allPhotos.length > 0) {
      const nextIndex = (currentIndex + 1) % allPhotos.length;
      const img = new Image();
      img.src = allPhotos[nextIndex];
    }
  }, [currentIndex, allPhotos]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
      }
      setIsMuted(!isMuted);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>사진을 불러오는 중...</div>;
  }

  if (allPhotos.length === 0) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>표시할 사진이 없습니다.</div>;
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: isFullscreen ? 'fixed' : 'relative',
        top: 0, left: 0, width: '100%',
        height: isFullscreen ? '100vh' : 'calc(100vh - 80px)',
        backgroundColor: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        zIndex: isFullscreen ? 9999 : 1
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={allPhotos[currentIndex]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </AnimatePresence>

      {/* Controls Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '15px 30px',
        borderRadius: '50px',
        backdropFilter: 'blur(10px)'
      }}>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ color: 'white', fontSize: '1.5rem' }}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={toggleFullscreen} style={{ color: 'white', fontSize: '1.5rem' }}>
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
        <button onClick={toggleMute} style={{ color: 'white', fontSize: '1.5rem' }}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>

      {/* Background Music */}
      {/* 
        참고: 잔잔하고 홀리한 음악을 사용하기 위해, 
        원하시는 mp3 파일을 다운받아 'public' 폴더 안에 'slideshow_music.mp3' 라는 이름으로 넣어주시면 됩니다. 
      */}
      <audio 
        ref={audioRef} 
        loop 
        muted={isMuted}
        src="/slideshow_music.mp3" 
      />
    </div>
  );
};

export default Slideshow;
