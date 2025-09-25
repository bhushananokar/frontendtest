import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const videos = [
  { id: 1, title: 'Mindfulness for Beginners', thumbnail: 'https://img.youtube.com/vi/a92r79V1_5c/default.jpg', views: '2.1M views' },
  { id: 2, title: 'Daily Gratitude Meditation', thumbnail: 'https://img.youtube.com/vi/P5Qf1m4B1xQ/default.jpg', views: '850K views' },
  { id: 3, title: '5-Minute Stress Relief', thumbnail: 'https://img.youtube.com/vi/a92r79V1_5c/default.jpg', views: '1.5M views' },
  { id: 4, title: 'How to Build Confidence', thumbnail: 'https://img.youtube.com/vi/P5Qf1m4B1xQ/default.jpg', views: '3.2M views' },
  { id: 5, title: 'Guided Sleep Hypnosis', thumbnail: 'https://img.youtube.com/vi/a92r79V1_5c/default.jpg', views: '5.4M views' },
  { id: 6, title: 'Productivity Hacks', thumbnail: 'https://img.youtube.com/vi/P5Qf1m4B1xQ/default.jpg', views: '980K views' },
];

export const YouTubeVideoCards: React.FC = () => {
  const cardWidth = 180;
  const gap = 16;
  const totalContentWidth = (videos.length * cardWidth) + ((videos.length - 1) * gap);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const scrollAmount = cardWidth * 2 + gap;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        onMouseEnter={() => setHoveredButton('left')}
        onMouseLeave={() => setHoveredButton(null)}
        style={{
          position: 'absolute',
          left: '-18px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: hoveredButton === 'left' ? '#f0f0f0' : 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          transition: 'background-color 0.2s'
        }}
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} color="#374151" />
      </button>

      <button
        onClick={scrollRight}
        onMouseEnter={() => setHoveredButton('right')}
        onMouseLeave={() => setHoveredButton(null)}
        style={{
          position: 'absolute',
          right: '-18px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: hoveredButton === 'right' ? '#f0f0f0' : 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          transition: 'background-color 0.2s'
        }}
        aria-label="Scroll right"
      >
        <ChevronRight size={18} color="#374151" />
      </button>

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        onWheel={handleScroll}
        style={{
          overflowX: 'auto',
          padding: '12px 0 20px 0', // Increased top and bottom padding
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          width: '100%',
        }}
      >
        <div
          style={{
            width: `${totalContentWidth}px`,
            display: 'flex',
            gap: `${gap}px`,
            flexWrap: 'nowrap',
          }}
        >
          {videos.map((video) => {
            const [isHovering, setIsHovering] = useState(false);
            return (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{
                  flexShrink: 0,
                  width: `${cardWidth}px`,
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  borderRadius: '6px',
                  overflow: 'hidden',
                  boxShadow: isHovering ? '0 4px 8px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  transform: isHovering ? 'translateY(-3px)' : 'translateY(0)',
                }}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div style={{ padding: '8px 12px' }}>
                    <h4 style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#1a202c',
                      margin: '0',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}>
                      {video.title}
                    </h4>
                    <p style={{
                      fontSize: '10px',
                      color: '#6b7280',
                      margin: '4px 0 0 0',
                    }}>
                      {video.views}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideoCards;