import React, { useState, useEffect } from 'react';
import GlobeViz from './components/GlobeViz';
import GlassPanel from './components/GlassPanel';
import TimeSlider from './components/TimeSlider';

export default function App() {
  const [globeData, setGlobeData] = useState([]);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Generate base mock data for rendering
    const generateMockData = () => {
      const palette = ['Joy', 'Anger', 'Fear', 'Surprise', 'Sadness', 'Disgust', 'Neutral'];
      return [...Array(40).keys()].map(i => {
        const dom = palette[Math.floor(Math.random() * palette.length)];
        return {
          id: `region-${i}`,
          lat: (Math.random() - 0.5) * 160,
          lng: (Math.random() - 0.5) * 360,
          altitude: 0.1 + Math.random() * 0.4,
          country: `Region ${i}`,
          dominant_emotion: dom,
          headline: `Live localized news event causing spikes in ${dom} across this region.`,
          scores: {
            Joy: dom === 'Joy' ? 50 + Math.random()*30 : Math.random()*20,
            Anger: dom === 'Anger' ? 50 + Math.random()*30 : Math.random()*20,
            Fear: dom === 'Fear' ? 50 + Math.random()*30 : Math.random()*20,
            Surprise: dom === 'Surprise' ? 50 + Math.random()*30 : Math.random()*20,
            Sadness: dom === 'Sadness' ? 50 + Math.random()*30 : Math.random()*20,
            Disgust: dom === 'Disgust' ? 50 + Math.random()*30 : Math.random()*20,
            Neutral: dom === 'Neutral' ? 50 + Math.random()*30 : Math.random()*20,
          }
        };
      });
    };

    setGlobeData(generateMockData());
  }, [currentDate]); // Regenerate data if time-travel slider moves

  // WebSocket Live Connection
  useEffect(() => {
    if (!isLive) return;

    // Connect to FastAPI backend WebSockets
    const ws = new WebSocket("ws://localhost:8000/ws/emotions/live");
    
    ws.onmessage = (event) => {
      try {
        const newEvent = JSON.parse(event.data);
        // Randomly assign it to a location on the globe for the prototype pulse
        newEvent.lat = (Math.random() - 0.5) * 160;
        newEvent.lng = (Math.random() - 0.5) * 360;
        newEvent.altitude = 0.8; // High altitude to create a huge "pulse"
        
        setGlobeData(prev => [newEvent, ...prev]);
      } catch (e) {
        console.error("Failed to parse WebSocket data", e);
      }
    };

    return () => ws.close();
  }, [isLive]);

  return (
    <div className="relative w-screen h-screen bg-void-bg overflow-hidden">
      <GlobeViz data={globeData} onHover={setHoveredRegion} />
      <GlassPanel data={hoveredRegion} />
      <TimeSlider 
        currentDate={currentDate} 
        onDateChange={setCurrentDate} 
        isLive={isLive} 
        setIsLive={setIsLive} 
      />
    </div>
  );
}
