import { useState, useEffect, useCallback, useRef } from 'react';
import { GameInitResponse, GameClickResponse, GameCompleteResponse, GameScreen, UI_COLORS } from '../../shared/types/api';

interface GameData {
  backgroundImage: string;
  snooPosition: { x: number; y: number };
  gameId: string;
}

interface GameStats {
  timeFinished: number;
  leaderboard: Array<{
    username: string;
    score: number;
    timeFinished: number;
  }>;
  playerRank: number;
}

// Homescreen Component - Enhanced Design
const Homescreen = ({ onPlayGame }: { onPlayGame: () => void }) => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: UI_COLORS.BACKGROUND_MAIN }}>
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-bounce" style={{ backgroundColor: UI_COLORS.POSITIVE_FEEDBACK, animationDelay: '0s' }}></div>
      <div className="absolute top-40 right-20 w-16 h-16 rounded-full opacity-15 animate-bounce" style={{ backgroundColor: UI_COLORS.NEGATIVE_FEEDBACK, animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full opacity-25 animate-bounce" style={{ backgroundColor: UI_COLORS.PRIMARY_BRAND, animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-1/3 w-14 h-14 rounded-full opacity-20 animate-bounce" style={{ backgroundColor: UI_COLORS.POSITIVE_FEEDBACK, animationDelay: '3s' }}></div>
    </div>
    
    <div className="text-center z-10 relative">
      {/* Enhanced title with gradient effect */}
      <div className="mb-8">
        <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
          Hide N' Snoo
        </h1>
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-16 h-1 rounded-full" style={{ backgroundColor: UI_COLORS.PRIMARY_BRAND }}></div>
          <span className="text-4xl">🔍</span>
          <div className="w-16 h-1 rounded-full" style={{ backgroundColor: UI_COLORS.PRIMARY_BRAND }}></div>
        </div>
      </div>
      
      <p className="text-2xl mb-12 text-gray-700 max-w-lg mx-auto leading-relaxed">
        Find the hidden Snoo before time runs out! 
        <br />
        <span className="text-lg opacity-75">Test your observation skills in this exciting hunt!</span>
      </p>
      
      {/* Enhanced play button with hover effects */}
      <div className="relative">
        <button
          onClick={onPlayGame}
          className="relative text-white py-6 px-16 rounded-full font-bold text-3xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
          style={{ backgroundColor: UI_COLORS.PRIMARY_BRAND }}
        >
          <span className="relative z-10 flex items-center gap-3">
            🎮 Play Game
          </span>
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300" style={{ backgroundColor: UI_COLORS.POSITIVE_FEEDBACK }}></div>
        </button>
        
        {/* Floating elements around button */}
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>🎯</div>
      </div>
    </div>
  </div>
);

// Guidelines Popup Component
const GuidelinesPopup = ({ onClose }: { onClose: () => void }) => (
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

// Try Again Screen Component - Enhanced Design
const TryAgainScreen = ({ onTryAgain }: { onTryAgain: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: UI_COLORS.BACKGROUND_POPUP + 'E6' }}>
    <div className="p-10 rounded-2xl text-center max-w-md mx-4 text-white relative overflow-hidden" style={{ backgroundColor: UI_COLORS.BACKGROUND_POPUP }}>
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-4 right-4 text-4xl opacity-20 animate-pulse">💔</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>😢</div>
      </div>
      
      <div className="relative z-10">
        <div className="text-6xl mb-6 animate-bounce">😵</div>
        <h2 className="text-5xl font-black mb-6" style={{ color: UI_COLORS.NEGATIVE_FEEDBACK }}>Game Over!</h2>
        <p className="text-2xl mb-8 opacity-90">Better luck next time!</p>
        <p className="text-lg mb-8 opacity-75">Don't give up - Snoo is waiting to be found! 🔍</p>
        
        <button
          onClick={onTryAgain}
          className="text-white py-4 px-12 rounded-full font-bold text-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          style={{ backgroundColor: UI_COLORS.PRIMARY_BRAND }}
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  </div>
);

// Congratulations Screen Component - Enhanced Design
const CongratulationsScreen = ({ stats, onEndGame }: { stats: GameStats; onEndGame: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onEndGame();
    }, 5000); // Auto-proceed after 5 seconds

    return () => clearTimeout(timer);
  }, [onEndGame]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: UI_COLORS.BACKGROUND_POPUP + 'E6' }}>
      <div className="p-10 rounded-2xl text-center max-w-lg mx-4 text-white relative overflow-hidden" style={{ backgroundColor: UI_COLORS.BACKGROUND_POPUP }}>
        {/* Celebration animations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-4 text-3xl animate-bounce">🎉</div>
          <div className="absolute top-4 right-4 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎊</div>
          <div className="absolute bottom-4 left-6 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>⭐</div>
          <div className="absolute bottom-4 right-6 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>🏆</div>
        </div>
        
        <div className="relative z-10">
          <div className="text-6xl mb-6 animate-bounce">🎯</div>
          <h2 className="text-5xl font-black mb-6" style={{ color: UI_COLORS.POSITIVE_FEEDBACK }}>Congratulations!</h2>
          <p className="text-2xl mb-6">You found Snoo! 🎉</p>
          
          <div className="bg-white/10 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: UI_COLORS.POSITIVE_FEEDBACK }}>
                  {stats.timeFinished.toFixed(1)}s
                </div>
                <div className="text-sm opacity-75">Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: UI_COLORS.POSITIVE_FEEDBACK }}>
                  #{stats.playerRank}
                </div>
                <div className="text-sm opacity-75">Rank</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              🏆 Leaderboard
            </h3>
            <div className="space-y-2 text-lg">
              {stats.leaderboard.slice(0, 5).map((entry, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-4 rounded-lg bg-white/5">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}</span>
                    #{index + 1} {entry.username}
                  </span>
                  <span className="font-bold">{entry.timeFinished.toFixed(1)}s</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const App = () => {
  const [screen, setScreen] = useState<GameScreen>('homescreen');
  const [showGuidelinesPopup, setShowGuidelinesPopup] = useState(false);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameStartTimeRef = useRef<number>(0);

  // Homescreen -> Guidelines Screen
  const handlePlayGame = useCallback(() => {
    setScreen('guidelines');
    setShowGuidelinesPopup(true);
  }, []);

  // Guidelines -> Game Screen
  const handleCloseGuidelines = useCallback(async () => {
    setShowGuidelinesPopup(false);
    setScreen('game');
    
    try {
      setError(null);
      
      const response = await fetch('/api/game/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to initialize game: ${response.status}`);
      }
      
      const data: GameInitResponse = await response.json();
      setGameData({
        backgroundImage: data.backgroundImage,
        snooPosition: data.snooPosition,
        gameId: data.gameId,
      });
      setLives(3);
      setTimeLeft(60);
      gameStartTimeRef.current = Date.now();
      
      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setScreen('try-again');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Game initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize game');
    }
  }, []);

  // Game Screen click handling
  const handleImageClick = useCallback(async (event: React.MouseEvent<HTMLImageElement | HTMLDivElement>) => {
    if (screen !== 'game' || !gameData) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    try {
      const response = await fetch('/api/game/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameData.gameId,
          clickX: x,
          clickY: y,
        }),
      });

      if (!response.ok) {
        throw new Error(`Click request failed: ${response.status}`);
      }

      const data: GameClickResponse = await response.json();
      
      if (data.hit) {
        // Player found Snoo - WIN!
        const timeFinished = (Date.now() - gameStartTimeRef.current) / 1000;
        
        const completeResponse = await fetch('/api/game/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameId: gameData.gameId,
            won: true,
            timeFinished,
          }),
        });

        if (completeResponse.ok) {
          const completeData: GameCompleteResponse = await completeResponse.json();
          setGameStats({
            timeFinished: completeData.timeFinished || timeFinished,
            leaderboard: completeData.leaderboard,
            playerRank: completeData.playerRank,
          });
        }
        
        setScreen('congratulations');
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // Wrong click - reduce lives
        setLives(data.livesRemaining);
        if (data.livesRemaining <= 0) {
          setScreen('try-again');
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      }
    } catch (err) {
      console.error('Click handling error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process click');
    }
  }, [screen, gameData]);

  // Snoo click handler - separate handler for direct Snoo clicks
  const handleSnooClick = useCallback(async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Prevent background click
    if (screen !== 'game' || !gameData) return;

    try {
      const response = await fetch('/api/game/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameData.gameId,
          clickX: gameData.snooPosition.x,
          clickY: gameData.snooPosition.y,
        }),
      });

      if (!response.ok) {
        throw new Error(`Click request failed: ${response.status}`);
      }

      // This should always be a hit since we're clicking directly on Snoo
      const timeFinished = (Date.now() - gameStartTimeRef.current) / 1000;
      
      const completeResponse = await fetch('/api/game/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameData.gameId,
          won: true,
          timeFinished,
        }),
      });

      if (completeResponse.ok) {
        const completeData: GameCompleteResponse = await completeResponse.json();
        setGameStats({
          timeFinished: completeData.timeFinished || timeFinished,
          leaderboard: completeData.leaderboard,
          playerRank: completeData.playerRank,
        });
      }
      
      setScreen('congratulations');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } catch (err) {
      console.error('Snoo click handling error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process Snoo click');
    }
  }, [screen, gameData]);

  // Try Again -> Homescreen
  const handleTryAgain = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setScreen('homescreen');
    setGameData(null);
    setGameStats(null);
    setError(null);
  }, []);

  // Congratulations -> End Game -> Homescreen
  const handleEndGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setScreen('homescreen');
    setGameData(null);
    setGameStats(null);
  }, []);

  // Auto-lose when timer reaches 0
  useEffect(() => {
    if (timeLeft <= 0 && screen === 'game') {
      setScreen('try-again');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [timeLeft, screen]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: UI_COLORS.BACKGROUND_MAIN }}>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: UI_COLORS.NEGATIVE_FEEDBACK }}>Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-white py-2 px-6 rounded-full font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: UI_COLORS.PRIMARY_BRAND }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: UI_COLORS.BACKGROUND_MAIN }}>
      {/* Screen Rendering */}
      {screen === 'homescreen' && <Homescreen onPlayGame={handlePlayGame} />}
      
      {screen === 'guidelines' && (
        <div className="min-h-screen" style={{ backgroundColor: UI_COLORS.BACKGROUND_MAIN }}>
          {showGuidelinesPopup && <GuidelinesPopup onClose={handleCloseGuidelines} />}
        </div>
      )}
      
      {screen === 'game' && gameData && (
        <div className="relative min-h-screen">
          {/* Game UI - Enhanced Design */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex justify-between items-center rounded-xl p-4 shadow-2xl backdrop-blur-sm border border-white/20" style={{ backgroundColor: UI_COLORS.BACKGROUND_MAIN + 'F0' }}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❤️</span>
                  <div className="text-xl font-bold">
                    <span style={{ color: lives <= 1 ? UI_COLORS.NEGATIVE_FEEDBACK : '#000000' }}>{lives}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏰</span>
                  <div className="text-xl font-bold">
                    <span style={{ color: timeLeft <= 10 ? UI_COLORS.NEGATIVE_FEEDBACK : '#000000' }}>{timeLeft}s</span>
                  </div>
                </div>
              </div>
              <div className="text-lg font-semibold px-4 py-2 rounded-full" style={{ backgroundColor: UI_COLORS.PRIMARY_BRAND, color: 'white' }}>
                Find Snoo! 🔍
              </div>
            </div>
          </div>

          {/* Game Image with Enhanced Styling */}
          <div className="w-full h-screen relative overflow-hidden">
            <img
              src={gameData.backgroundImage}
              alt="Find Snoo in this image"
              className="w-full h-full object-cover cursor-crosshair"
              onClick={handleImageClick}
              draggable={false}
            />
            
            {/* Enhanced Snoo with Glow Effect */}
            <div
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
              style={{
                left: `${gameData.snooPosition.x}%`,
                top: `${gameData.snooPosition.y}%`,
                width: '60px',
                height: '60px',
              }}
              onClick={handleSnooClick}
            >
              <div className="relative w-full h-full">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-full bg-white/30 blur-sm animate-pulse"></div>
                <img
                  src="/snoo.png"
                  alt="Snoo"
                  className="relative w-full h-full object-contain drop-shadow-2xl"
                  draggable={false}
                />
              </div>
            </div>

            {/* Floating particles for visual enhancement */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/35 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay Screens */}
      {screen === 'try-again' && <TryAgainScreen onTryAgain={handleTryAgain} />}
      {screen === 'congratulations' && gameStats && (
        <CongratulationsScreen stats={gameStats} onEndGame={handleEndGame} />
      )}
    </div>
  );
};
