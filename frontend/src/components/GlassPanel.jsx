import React from 'react';
import { Share2, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function GlassPanel({ data }) {
  const colorPalette = {
    'Joy': 'text-mood-joy',
    'Anger': 'text-mood-anger',
    'Fear': 'text-mood-fear',
    'Surprise': 'text-mood-surprise',
    'Sadness': 'text-mood-sadness',
    'Disgust': 'text-mood-disgust',
    'Neutral': 'text-mood-neutral'
  };

  const bgPalette = {
    'Joy': 'bg-mood-joy',
    'Anger': 'bg-mood-anger',
    'Fear': 'bg-mood-fear',
    'Surprise': 'bg-mood-surprise',
    'Sadness': 'bg-mood-sadness',
    'Disgust': 'bg-mood-disgust',
    'Neutral': 'bg-mood-neutral'
  };

  const handleShare = async () => {
    try {
      // Capture the entire screen for the "Zero-Click Share" feature
      const canvas = await html2canvas(document.body, {
        backgroundColor: '#050510',
        useCORS: true
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `Global-Mood-${data?.country || 'Dashboard'}-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (err) {
      console.error("Screenshot failed", err);
    }
  };

  return (
    <div 
      className={`absolute top-6 right-6 w-80 glass-panel p-6 transition-all duration-300 ease-out transform ${
        data ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 pointer-events-none'
      }`}
    >
      {data && (
        <>
          <h2 className="text-2xl font-light tracking-wider mb-1">{data.country}</h2>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-6">
            Dominant: <span className={`font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] ${colorPalette[data.dominant_emotion]}`}>{data.dominant_emotion}</span>
          </div>

          <div className="space-y-3">
            {Object.entries(data.scores).sort((a, b) => b[1] - a[1]).map(([emotion, score]) => (
              <div key={emotion} className="flex items-center">
                <div className={`w-20 text-sm font-semibold tracking-wide ${colorPalette[emotion]}`}>
                  {emotion}
                </div>
                <div className="flex-grow h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${bgPalette[emotion]}`} 
                    style={{ width: `${score}%`, boxShadow: '0 0 8px currentColor' }}
                  />
                </div>
                <div className="w-10 text-right text-xs font-semibold text-gray-400 ml-3">
                  {Math.round(score)}%
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 text-sm italic text-gray-300 leading-relaxed">
            "{data.headline}"
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors cursor-default" title="Data synced to Time Slider">
              <Clock size={18} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors" 
              title="Capture & Share to Social Media"
            >
              <Share2 size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
