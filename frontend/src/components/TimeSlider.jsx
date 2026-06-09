import React from 'react';

export default function TimeSlider({ currentDate, onDateChange, isLive, setIsLive }) {
  // Simple slider ranging over the last 30 days
  const handleSliderChange = (e) => {
    const daysAgo = 30 - parseInt(e.target.value);
    if (daysAgo === 0) {
      setIsLive(true);
      onDateChange(new Date().toISOString().split('T')[0]);
    } else {
      setIsLive(false);
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      onDateChange(d.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-xl glass-panel p-4 flex flex-col items-center">
      <div className="w-full flex justify-between text-xs text-gray-400 font-semibold tracking-wider mb-3 px-2">
        <span>30 Days Ago</span>
        <span className={isLive ? "text-mood-joy drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" : "text-white"}>
          {isLive ? "● LIVE" : currentDate}
        </span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="30" 
        defaultValue="30"
        onChange={handleSliderChange}
        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 transition-colors"
      />
    </div>
  );
}
