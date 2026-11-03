export type GameMode = 'vs-computer' | 'pass-and-play';

export type AIDifficulty = 'easy' | 'medium' | 'pro';

export type TableTheme =
  | 'scratched-wood'    // স্কুলের দাগওয়ালা পুরোনো কাঠের বেঞ্চ (Authentic high school bench)
  | 'green-board'        // সবুজ ক্লাসরুম ডেস্ক (Weathered green painted classroom desk)
  | 'dark-teak'          // গাঢ় সেগুন কাঠের বেঞ্চ (Deep teak wood bench)
  | 'notebook-desk'      // খাতা ও মার্জিন পেপারের ডেস্ক (Ruled school notebook paper surface)
  | 'science-lab';       // ল্যাবরেটরি স্লেট ডেস্ক (Science lab slate table)

export type AimControlMode = 'slingshot' | 'direct';

export interface PenConfig {
  id: string;
  name: string;
  englishName: string;
  tagline: string;
  description: string;
  weight: number;      // 1 to 5 (mass)
  speed: number;       // 1 to 5 (impact thrust)
  friction: number;    // 1 to 5 (grip / slide resistance)
  color: string;       // Primary barrel color
  secondaryColor: string; // Cap / grip color
  accentColor: string; // Tip / clip color
  gripType: 'classic' | 'ridged' | 'metallic' | 'rubber';
  barrelStyle: 'round' | 'hexagonal' | 'fountain' | 'gel';
  length: number;      // Virtual px length
  width: number;       // Virtual px width
}

export interface PenEntity {
  id: 'player1' | 'player2';
  name: string;
  config: PenConfig;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;       // in radians
  vRot: number;        // angular velocity in rad/sec
  isFalling: boolean;
  fallProgress: number;// 0 to 1
  fallScale: number;
  fallRotation: number;
  isOffTable: boolean;
}

export interface GameRoundState {
  player1Score: number;
  player2Score: number;
  currentRound: number;
  maxRounds: number;    // 3 for best of 3, 5 for best of 5
  currentTurn: 'player1' | 'player2';
  isSimulating: boolean;
  winner: 'player1' | 'player2' | 'draw' | null;
  matchWinner: 'player1' | 'player2' | null;
  lastEvent: string | null;
}
