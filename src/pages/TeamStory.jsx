import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { FaChevronLeft, FaChevronRight, FaTimes, FaArrowLeft } from 'react-icons/fa';

const missionDetails = [
  { id: 'mission1', title: '[출발] 배봉산 입구 단체샷', desc: '산행 시작 전, 우리 팀의 활기찬 출발 모습을 찍어주세요.' },
  { id: 'mission2', title: '[인증] 입장권 팔찌 찰칵', desc: '팀원들의 손목에 찬 입장권 팔찌가 잘 보이도록 모아서 찍어주세요.' },
  { id: 'mission3', title: '[둘레길] 꽃보다 팀원', desc: '둘레길의 예쁜 풍경 앞에서 팀원 모두 꽃받침 포즈를 취해주세요.' },
  { id: 'mission4', title: '[정상] 손가락 별 만들기', desc: '배봉산 정상 정복 완료! 팀원들의 손가락을 모아 별을 만들어주세요.' },
  { id: 'mission5', title: '[축복] 축복의 만남', desc: '정상에서 만난 목사님 또는 성도님들과 함께 기쁨의 순간을 찍어주세요.' },
  { id: 'mission6', title: '[완주] 무사 완주 피날레', desc: '모든 코스를 마친 기쁨을 단체 사진으로 남겨주세요.' },
];

const TeamStory = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const docRef = doc(db, 'teams', teamId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const teamData = { id: docSnap.id, ...docSnap.data() };
          
          // Fetch photos from storage
          const teamPhotos = { mission1: null, mission2: null, mission3: null, mission4: null, mission5: null, mission6: null };
          try {
            if (teamData.id) {
              const teamFolderRef = ref(storage, `mission-photos/${teamData.id}`);
              const res = await listAll(teamFolderRef);
              for (const itemRef of res.items) {
                const url = await getDownloadURL(itemRef);
                const fileName = itemRef.name.toLowerCase();
                if (fileName.includes('place-1')) teamPhotos.mission1 = url;
                else if (fileName.includes('place-2')) teamPhotos.mission2 = url;
                else if (fileName.includes('place-3')) teamPhotos.mission3 = url;
                else if (fileName.includes('place-4')) teamPhotos.mission4 = url;
                else if (fileName.includes('place-5')) teamPhotos.mission5 = url;
                else if (fileName.includes('place-6')) teamPhotos.mission6 = url;
              }
            }
          } catch (storageErr) {
            console.error("Error fetching storage photos:", storageErr);
          }
          
          setTeam({ ...teamData, photos: teamPhotos });
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [teamId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>로딩중...</div>;
  }

  if (!team) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>팀을 찾을 수 없습니다.</div>;
  }

  const photos = team.photos || {};

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % missionDetails.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + missionDetails.length) % missionDetails.length);
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      style={{ padding: '40px 20px', position: 'relative' }}
    >
      <Link to="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '20px' }}>
        <FaArrowLeft /> 목록으로 돌아가기
      </Link>

      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
          {team.teamName || `팀 ${team.id}`}의 스토리
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>우리 팀이 함께 만들어간 봄소풍의 추억</p>
      </div>

      <div className="story-timeline" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        {missionDetails.map((mission, index) => {
          const photoUrl = photos[mission.id];
          const isEven = index % 2 === 0;
          
          return (
            <motion.div 
              key={mission.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: window.innerWidth <= 768 ? 'column' : (isEven ? 'row' : 'row-reverse'),
                gap: '30px',
                marginBottom: '60px',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1, textAlign: window.innerWidth <= 768 ? 'center' : (isEven ? 'right' : 'left') }}>
                <h3 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '10px' }}>{mission.title}</h3>
                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.6' }}>{mission.desc}</p>
              </div>

              <div 
                style={{ flex: 1, cursor: photoUrl ? 'pointer' : 'default' }}
                onClick={() => photoUrl && openLightbox(index)}
              >
                <div className="glass" style={{
                  padding: '10px',
                  borderRadius: 'var(--border-radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  transform: 'rotate(2deg)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(0deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(2deg)'}
                >
                  {photoUrl ? (
                    <img 
                      src={photoUrl} 
                      alt={mission.title} 
                      style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '300px', 
                      backgroundColor: 'rgba(0,0,0,0.05)', 
                      borderRadius: 'var(--border-radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)'
                    }}>
                      사진이 없습니다
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={closeLightbox}
          >
            <button style={{ position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '2rem' }} onClick={closeLightbox}>
              <FaTimes />
            </button>

            <div style={{ position: 'absolute', top: '20px', left: '30px', color: 'white', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{missionDetails[currentIndex].title}</h3>
              <p style={{ opacity: 0.8 }}>{missionDetails[currentIndex].desc}</p>
            </div>

            <button 
              style={{ position: 'absolute', left: '20px', color: 'white', fontSize: '3rem', padding: '20px' }} 
              onClick={prevPhoto}
            >
              <FaChevronLeft />
            </button>

            <motion.img 
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={photos[missionDetails[currentIndex].id] || ''} 
              alt="Mission" 
              style={{ maxHeight: '80vh', maxWidth: '80vw', objectFit: 'contain', borderRadius: '10px' }}
              onClick={(e) => e.stopPropagation()}
            />

            <button 
              style={{ position: 'absolute', right: '20px', color: 'white', fontSize: '3rem', padding: '20px' }} 
              onClick={nextPhoto}
            >
              <FaChevronRight />
            </button>
            
            {/* Dots */}
            <div style={{ position: 'absolute', bottom: '30px', display: 'flex', gap: '10px' }}>
              {missionDetails.map((_, idx) => (
                <div 
                  key={idx}
                  style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    backgroundColor: currentIndex === idx ? 'var(--primary-color)' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeamStory;
