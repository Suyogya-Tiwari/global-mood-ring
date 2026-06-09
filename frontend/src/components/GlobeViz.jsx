import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeViz({ data, onHover }) {
  const globeEl = useRef();
  
  const colorPalette = {
    'Joy': '#FFD700',
    'Anger': '#FF003C',
    'Fear': '#8A2BE2',
    'Surprise': '#00FFFF',
    'Sadness': '#4B0082',
    'Disgust': '#32CD32',
    'Neutral': '#F8F8FF'
  };

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableDamping = true;
      globeEl.current.controls().dampingFactor = 0.05;
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full cursor-move">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="#050510"
        
        // Data points configuration
        pointsData={data}
        pointLat="lat"
        pointLng="lng"
        pointAltitude="altitude"
        pointColor={d => colorPalette[d.dominant_emotion] || '#ffffff'}
        pointRadius={1.5}
        pointsMerge={false}
        pointResolution={32}
        
        // Interaction
        onPointHover={onHover}
      />
    </div>
  );
}
