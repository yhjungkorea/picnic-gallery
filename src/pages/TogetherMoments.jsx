import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 사용자가 추가로 업로드해야 하는 사진들의 경로 또는 URL입니다.
// 방법 1 (권장): 사진을 프로젝트의 public/assets 폴더에 넣고 경로를 여기에 적습니다. (예: '/assets/group-photo.jpg')
// 방법 2: Firebase Storage에 사진을 직접 업로드하고 그 URL을 여기에 적습니다.
const eventPhotos = [
  { id: 1, type: 'group', url: '../public/images/main-group.jpg', title: '봄소풍 도착지 단체사진' },
  { id: 2, type: 'event', url: '../public/images/00.jpg', title: '기대와 설렘으로 봄소풍 시작' },
  { id: 3, type: 'event', url: '../public/images/01.jpg', title: '즐거움은 이미 정상급' },
  { id: 4, type: 'event', url: '../public/images/02.jpg', title: '웃음도 체력도 준비 완료' },
  { id: 5, type: 'event', url: '../public/images/03.jpg', title: '숲길 위의 브이 요정들' },
  { id: 6, type: 'event', url: '../public/images/04.jpg', title: '우리들의 방식으로 봄소풍 즐기기' },
  { id: 7, type: 'event', url: '../public/images/05.jpg', title: '잠시 쉬어가는 행복' },
  { id: 8, type: 'event', url: '../public/images/06.jpg', title: '배봉산의 바람을 담은 순간' },
  { id: 9, type: 'event', url: '../public/images/07.jpg', title: '배봉산 접수 완료' },
  { id: 10, type: 'event', url: '../public/images/08.jpg', title: '풍경보다 빛났던 얼굴들' },
  { id: 11, type: 'event', url: '../public/images/09.jpg', title: '정상에서 외친 기쁨' },
  { id: 12, type: 'event', url: '../public/images/10.jpg', title: '성덕교회, 함께한 봄날' },
  { id: 13, type: 'event', url: '../public/images/100.jpg', title: '두근두근, 오늘의 행운은?' },
  { id: 14, type: 'event', url: '../public/images/101.jpg', title: '당첨보다 더 큰 미소' },
  { id: 15, type: 'event', url: '../public/images/102.jpg', title: '행복을 한아름 안고' },
  { id: 16, type: 'event', url: '../public/images/103.jpg', title: '행운은 누가에게?' },
  { id: 17, type: 'event', url: '../public/images/104.jpg', title: '걸음에서도 느껴지는 기쁨' },
  { id: 18, type: 'event', url: '../public/images/105.jpg', title: '기쁨이 터지는 순간' },
];

const phrases = [
  "함께 걸어서 더 즐거웠던 하루",
  "웃음과 기쁨이 가득했던 봄소풍",
  "공동체의 따뜻함이 담긴 순간"
];

const TogetherMoments = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const groupPhotos = eventPhotos.filter(p => p.type === 'group');
  const otherPhotos = eventPhotos.filter(p => p.type === 'event');

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '40px 20px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>함께한 순간</h2>
        
        <div style={{ height: '30px', overflow: 'hidden', position: 'relative' }}>
          <motion.p 
            key={currentPhrase}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '1.2rem', color: 'var(--text-muted)', position: 'absolute', width: '100%' }}
          >
            {phrases[currentPhrase]}
          </motion.p>
        </div>
      </div>

      <section style={{ marginBottom: '80px' }}>
        <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-color)', marginBottom: '20px', textAlign: 'center' }}>모두 함께한 순간</h3>
        <div className="glass" style={{ padding: '15px', borderRadius: 'var(--border-radius-lg)' }}>
          {groupPhotos.length > 0 ? (
            <img 
              src={groupPhotos[0].url} 
              alt="단체사진" 
              style={{ width: '100%', borderRadius: 'var(--border-radius-md)' }} 
            />
          ) : (
             <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 'var(--border-radius-md)' }}>
              단체 사진을 업로드해주세요.
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-color)', marginBottom: '30px', textAlign: 'center' }}>웃음과 기쁨이 가득했던 봄소풍</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {otherPhotos.map((photo, index) => (
            <motion.div 
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass"
              style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}
            >
              <img 
                src={photo.url} 
                alt={photo.title} 
                style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
              />
              <div style={{ padding: '15px', textAlign: 'center' }}>
                <p style={{ fontWeight: '500' }}>{photo.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default TogetherMoments;
