import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTeamsData } from '../hooks/useTeamsData';

const MissionGallery = () => {
  const { teams, loading } = useTeamsData();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>로딩중...</p>
      </div>
    );
  }

  // Sort teams ascending by name (pad numbers internally to ensure correct order)
  const sortedTeams = [...teams].sort((a, b) => {
    const padNumbers = (str) => str.replace(/\d+/g, (match) => match.padStart(2, '0'));
    const nameA = padNumbers(a.teamName || '');
    const nameB = padNumbers(b.teamName || '');
    return nameA.localeCompare(nameB, 'ko-KR');
  });

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '40px 20px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>미션 전시관</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>각 팀이 완성한 아름다운 봄소풍 미션을 감상해보세요.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '30px' 
      }}>
        {sortedTeams.map((team, index) => {
          // Find a representative photo (first available)
          const photos = team.photos ? Object.values(team.photos).filter(p => p !== null) : [];
          const coverPhoto = photos.length > 0 ? photos[0] : 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=600&h=400';

          return (
            <motion.div 
              key={team.id}
              className="team-card glass"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              style={{
                borderRadius: 'var(--border-radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                height: '200px',
                width: '100%',
                backgroundImage: `url(${coverPhoto})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              
              <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', color: 'var(--text-main)' }}>
                  {team.teamName || `팀 ${team.id}`}
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
                  등록된 미션 사진: {photos.length}장
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Link 
                    to={`/gallery/${team.id}`} 
                    className="btn-primary"
                    style={{ display: 'block', textAlign: 'center', padding: '10px 0', fontSize: '1rem' }}
                  >
                    팀 스토리 보기
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MissionGallery;
