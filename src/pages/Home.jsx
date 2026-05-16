import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useTeamsData } from '../hooks/useTeamsData';

const Home = () => {
  const { teams, loading } = useTeamsData();
  const [visitorCount, setVisitorCount] = useState(0);
  
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const visitDocRef = doc(db, 'stats', 'visitors');
        const visitSnap = await getDoc(visitDocRef);
        
        if (!visitSnap.exists()) {
          await setDoc(visitDocRef, { count: 1 });
          setVisitorCount(1);
        } else {
          // Increment only once per session
          if (!sessionStorage.getItem('visited')) {
            await updateDoc(visitDocRef, { count: increment(1) });
            sessionStorage.setItem('visited', 'true');
            setVisitorCount(visitSnap.data().count + 1);
          } else {
            setVisitorCount(visitSnap.data().count);
          }
        }
      } catch (e) {
        console.error("Error tracking visitor:", e);
      }
    };
    trackVisitor();
  }, []);
  
  // Calculate total photos
  const totalPhotos = teams.reduce((acc, team) => {
    let count = 0;
    if (team.photos) {
      Object.values(team.photos).forEach(photo => {
        if (photo) count++;
      });
    }
    return acc + count;
  }, 0);

  // Use a placeholder group photo or a hero image
  const heroImage = "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&q=80&w=1200&h=600";

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hero-section" style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-color)',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-main)',
        textAlign: 'center',
        padding: '60px 20px'
      }}>
        <div className="hero-content">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
              display: 'inline-block', 
              padding: '6px 12px', 
              backgroundColor: 'rgba(70, 132, 50, 0.1)', 
              color: 'var(--primary-color)',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '20px'
            }}
          >
            2026 SUNGDUK CHURCH PICNIC
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '700', letterSpacing: '-1px' }}
          >
            2026 성덕교회 봄소풍<br/>온라인 전시회
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.8' }}
          >
            성덕교회 {teams.length > 0 ? teams.length : '20'}개 팀이 함께 걸으며 완성한 봄소풍 미션,<br/>
            웃음과 기쁨이 담긴 하루의 추억을 함께 나눕니다.
          </motion.p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link to="/gallery" className="btn-primary" style={{ fontSize: '1.2rem', padding: '16px 48px' }}>
              전시회 입장하기
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 20px', backgroundColor: 'var(--background-light)' }}>
        <div className="stats-section" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px',
          flexWrap: 'wrap'
        }}>
          <motion.div 
            className="stat-card glass"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            style={{ padding: '40px', borderRadius: 'var(--border-radius-md)', textAlign: 'center', flex: '1', minWidth: '200px' }}
          >
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>참여 팀</h3>
            <p className="text-gradient" style={{ fontSize: '4rem', fontWeight: '700', margin: '10px 0' }}>
              {loading ? '...' : teams.length}
            </p>
            <p>함께한 팀들</p>
          </motion.div>

          <motion.div 
            className="stat-card glass"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ padding: '40px', borderRadius: 'var(--border-radius-md)', textAlign: 'center', flex: '1', minWidth: '200px' }}
          >
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>미션 사진</h3>
            <p className="text-gradient" style={{ fontSize: '4rem', fontWeight: '700', margin: '10px 0' }}>
              {loading ? '...' : totalPhotos}
            </p>
            <p>기록된 추억들</p>
          </motion.div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            총 방문자 수: {visitorCount || '...'}명
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
