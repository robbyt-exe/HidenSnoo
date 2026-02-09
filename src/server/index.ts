import express from 'express';
import { InitResponse, IncrementResponse, DecrementResponse, GameInitResponse, GameClickResponse, GameCompleteResponse } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// Background patterns for the game - using data URLs for reliability
const BACKGROUND_PATTERNS = [
  // Colorful geometric patterns as data URLs
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern1" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="#FF6B6B"/>
          <rect x="50" y="0" width="50" height="50" fill="#4ECDC4"/>
          <rect x="0" y="50" width="50" height="50" fill="#45B7D1"/>
          <rect x="50" y="50" width="50" height="50" fill="#96CEB4"/>
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#pattern1)"/>
      <circle cx="200" cy="150" r="30" fill="#FFA07A" opacity="0.7"/>
      <circle cx="600" cy="300" r="40" fill="#98D8C8" opacity="0.7"/>
      <circle cx="400" cy="450" r="35" fill="#F7DC6F" opacity="0.7"/>
    </svg>
  `),
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#E8F4FD"/>
      <polygon points="100,100 200,50 300,100 250,200 150,200" fill="#FF8A80" opacity="0.8"/>
      <polygon points="500,200 600,150 700,200 650,300 550,300" fill="#81C784" opacity="0.8"/>
      <polygon points="200,350 300,300 400,350 350,450 250,450" fill="#64B5F6" opacity="0.8"/>
      <polygon points="600,400 700,350 750,450 650,500 550,450" fill="#FFB74D" opacity="0.8"/>
    </svg>
  `),
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#FFF3E0"/>
      <rect x="50" y="50" width="150" height="100" fill="#FFCDD2" opacity="0.8"/>
      <rect x="300" y="100" width="200" height="80" fill="#C8E6C9" opacity="0.8"/>
      <rect x="100" y="250" width="180" height="120" fill="#BBDEFB" opacity="0.8"/>
      <rect x="400" y="300" width="160" height="90" fill="#F8BBD9" opacity="0.8"/>
      <rect x="600" y="150" width="140" height="110" fill="#DCEDC8" opacity="0.8"/>
    </svg>
  `),
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#F3E5F5"/>
      <ellipse cx="150" cy="120" rx="60" ry="40" fill="#E1BEE7" opacity="0.9"/>
      <ellipse cx="400" cy="200" rx="80" ry="50" fill="#C5E1A5" opacity="0.9"/>
      <ellipse cx="650" cy="150" rx="70" ry="45" fill="#FFECB3" opacity="0.9"/>
      <ellipse cx="250" cy="350" rx="90" ry="60" fill="#B3E5FC" opacity="0.9"/>
      <ellipse cx="550" cy="400" rx="75" ry="55" fill="#FFCCCB" opacity="0.9"/>
    </svg>
  `),
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#E0F2F1"/>
      <path d="M100,200 Q200,100 300,200 T500,200" stroke="#4DB6AC" stroke-width="20" fill="none" opacity="0.7"/>
      <path d="M150,350 Q250,250 350,350 T550,350" stroke="#81C784" stroke-width="25" fill="none" opacity="0.7"/>
      <path d="M200,500 Q300,400 400,500 T600,500" stroke="#FFB74D" stroke-width="22" fill="none" opacity="0.7"/>
      <circle cx="100" cy="100" r="25" fill="#E57373" opacity="0.8"/>
      <circle cx="700" cy="500" r="30" fill="#64B5F6" opacity="0.8"/>
    </svg>
  `)
];

// Game state interface
interface GameSession {
  gameId: string;
  postId: string;
  backgroundImage: string;
  snooPosition: { x: number; y: number };
  lives: number;
  startTime: number;
  completed: boolean;
}

// Helper function to generate random position
function generateRandomPosition(): { x: number; y: number } {
  return {
    x: Math.random() * 80 + 10, // 10% to 90% to avoid edges
    y: Math.random() * 80 + 10, // 10% to 90% to avoid edges
  };
}

// Helper function to check if click is near Snoo (within 6% radius to account for Snoo image size)
function isClickNearSnoo(clickX: number, clickY: number, snooX: number, snooY: number): boolean {
  const distance = Math.sqrt(Math.pow(clickX - snooX, 2) + Math.pow(clickY - snooY, 2));
  return distance <= 6; // 6% radius to account for Snoo image size
}

// Helper function to calculate score based on time
function calculateScore(timeFinished: number): number {
  return Math.max(1000 - Math.floor(timeFinished * 10), 100);
}

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [count, username] = await Promise.all([
        redis.get('count'),
        reddit.getCurrentUsername(),
      ]);

      res.json({
        type: 'init',
        postId: postId as string,
        count: count ? parseInt(count) : 0,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
  '/api/increment',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', 1),
      postId: postId as string,
      type: 'increment',
    });
  }
);

router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
  '/api/decrement',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', -1),
      postId: postId as string,
      type: 'decrement',
    });
  }
);

// Game API endpoints
router.post<{}, GameInitResponse | { status: string; message: string }, unknown>(
  '/api/game/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    // TypeScript type guard - postId is guaranteed to be string here
    const safePostId: string = postId;

    try {
      const gameId = `game_${safePostId}_${Date.now()}`;
      const backgroundImage = BACKGROUND_PATTERNS[Math.floor(Math.random() * BACKGROUND_PATTERNS.length)];
      const snooPosition = generateRandomPosition();

      const gameSession: GameSession = {
        gameId,
        postId: safePostId,
        backgroundImage,
        snooPosition,
        lives: 3,
        startTime: Date.now(),
        completed: false,
      };

      // Store game session in Redis
      await redis.set(`game_session_${gameId}`, JSON.stringify(gameSession));
      await redis.expire(`game_session_${gameId}`, 300); // 5 minute expiry

      res.json({
        type: 'game-init',
        postId: safePostId,
        backgroundImage,
        snooPosition,
        gameId,
      });
    } catch (error) {
      console.error('Game init error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to initialize game',
      });
    }
  }
);

router.post<{}, GameClickResponse | { status: string; message: string }, { gameId: string; clickX: number; clickY: number }>(
  '/api/game/click',
  async (req, res): Promise<void> => {
    const { postId } = context;
    const { gameId, clickX, clickY } = req.body;

    if (!postId || !gameId) {
      res.status(400).json({
        status: 'error',
        message: 'postId and gameId are required',
      });
      return;
    }

    try {
      const sessionData = await redis.get(`game_session_${gameId}`);
      if (!sessionData) {
        res.status(404).json({
          status: 'error',
          message: 'Game session not found',
        });
        return;
      }

      const gameSession: GameSession = JSON.parse(sessionData);
      
      if (gameSession.completed) {
        res.status(400).json({
          status: 'error',
          message: 'Game already completed',
        });
        return;
      }

      const hit = isClickNearSnoo(clickX, clickY, gameSession.snooPosition.x, gameSession.snooPosition.y);
      
      if (!hit) {
        gameSession.lives -= 1;
      }

      // Update game session
      await redis.set(`game_session_${gameId}`, JSON.stringify(gameSession));
      await redis.expire(`game_session_${gameId}`, 300);

      res.json({
        type: 'game-click',
        postId: postId as string,
        gameId,
        hit,
        livesRemaining: gameSession.lives,
      });
    } catch (error) {
      console.error('Game click error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to process click',
      });
    }
  }
);

router.post<{}, GameCompleteResponse | { status: string; message: string }, { gameId: string; won: boolean; timeFinished: number }>(
  '/api/game/complete',
  async (req, res): Promise<void> => {
    const { postId } = context;
    const { gameId, won, timeFinished } = req.body;

    if (!postId || !gameId) {
      res.status(400).json({
        status: 'error',
        message: 'postId and gameId are required',
      });
      return;
    }

    try {
      const sessionData = await redis.get(`game_session_${gameId}`);
      if (!sessionData) {
        res.status(404).json({
          status: 'error',
          message: 'Game session not found',
        });
        return;
      }

      const gameSession: GameSession = JSON.parse(sessionData);
      gameSession.completed = true;

      // Update game session
      await redis.set(`game_session_${gameId}`, JSON.stringify(gameSession));
      await redis.expire(`game_session_${gameId}`, 300);

      const username = await reddit.getCurrentUsername() || 'anonymous';
      const finalScore = won ? calculateScore(timeFinished) : 0;

      // Store score in leaderboard if won
      if (won) {
        const leaderboardKey = `leaderboard_${postId}`;
        const scoreData = JSON.stringify({
          username,
          score: finalScore,
          timeFinished,
          timestamp: Date.now(),
        });
        
        await redis.zAdd(leaderboardKey, { score: finalScore, member: scoreData });
      }

      // Get leaderboard - simplified approach
      const leaderboardKey = `leaderboard_${postId}`;
      const leaderboardData = await redis.zRange(leaderboardKey, 0, 9, { by: 'rank', reverse: true }); // Top 10
      
      const leaderboard = leaderboardData.map((entry) => {
        const data = JSON.parse(entry.member);
        return {
          username: data.username,
          score: data.score,
          timeFinished: data.timeFinished,
        };
      });

      // Calculate player rank - simplified
      let playerRank = 1;
      if (won) {
        // Simple rank calculation based on leaderboard position
        const playerIndex = leaderboard.findIndex(entry => entry.username === username && entry.score === finalScore);
        playerRank = playerIndex >= 0 ? playerIndex + 1 : leaderboard.length + 1;
      }

      res.json({
        type: 'game-complete',
        postId: postId as string,
        gameId,
        won,
        timeFinished,
        finalScore,
        leaderboard,
        playerRank,
      });
    } catch (error) {
      console.error('Game complete error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to complete game',
      });
    }
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
