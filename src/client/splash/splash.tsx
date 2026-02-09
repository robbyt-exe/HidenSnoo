import '../index.css';

import { navigateTo } from '@devvit/web/client';
import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { UI_COLORS } from '../../shared/types/api';

const Guidelines = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: UI_COLORS.BACKGROUND_POPUP + 'E6' }}>
      <div className="p-8 rounded-lg max-w-md mx-4 text-white" style={{ backgroundColor: UI_COLORS.BACKGROUND_POPUP }}>
        <h2 className="text-3xl font-bold mb-6" style={{ color: UI_COLORS.POSITIVE_FEEDBACK }}>How to Play</h2>
        <div className="space-y-4 mb-8">
          <p>🎯 Find the hidden Snoo in the image</p>
          <p>⏰ You have 60 seconds to find Snoo</p>
          <p>❤️ You have 3 lives - wrong clicks reduce lives</p>
          <p>🏆 Find Snoo quickly to get a high score!</p>
        </div>
        <button
          onClick={onClose}
          className="w-full text-white py-3 px-6 rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: UI_COLORS.PRIMARY_BRAND }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const Splash = () => {
  const [showGuidelines, setShowGuidelines] = useState(false);

  return (
    <>
      <div className="flex relative flex-col justify-center items-center min-h-screen gap-8" style={{ backgroundColor: UI_COLORS.BACKGROUND_MAIN }}>
        <img className="object-contain w-1/2 max-w-[200px] mx-auto drop-shadow-lg" src="/snoo.png" alt="Snoo" />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold text-center text-gray-900">
            Hide N' Snoo
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-md">
            Hey {context.username ?? 'user'}! Can you find the hidden Snoo before time runs out?
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 mt-6">
          <button
            className="text-white py-4 px-12 rounded-full font-bold text-2xl hover:opacity-90 transition-opacity shadow-lg"
            style={{ backgroundColor: UI_COLORS.PRIMARY_BRAND }}
            onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
          >
            Play Game
          </button>
          <button
            className="text-gray-700 py-3 px-8 rounded-full font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#E5E7EB' }}
            onClick={() => setShowGuidelines(true)}
          >
            How to Play
          </button>
        </div>
      </div>
      {showGuidelines && <Guidelines onClose={() => setShowGuidelines(false)} />}
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
