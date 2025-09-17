import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameTimer } from './GameTimer';
import { CipherChallenge, Cipher } from './CipherChallenge';
import { Leaderboard } from './Leaderboard';
import { ciphers } from '@/data/ciphers';
import { Play, RotateCcw, Crown, Target, Clock, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Team {
  id: string;
  name: string;
  player1: string;
  player2: string;
  createdAt: number;
}

interface GameState {
  isActive: boolean;
  currentLevel: number;
  startTime: number;
  levelStartTime: number;
  completedLevels: string[];
  totalPoints: number;
  totalTime: number;
}

interface GameInterfaceProps {
  team: Team;
  onBackToMenu: () => void;
}

export const GameInterface = ({ team, onBackToMenu }: GameInterfaceProps) => {
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    currentLevel: 0,
    startTime: 0,
    levelStartTime: 0,
    completedLevels: [],
    totalPoints: 0,
    totalTime: 0,
  });

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameTimeLimit] = useState(30 * 60 * 1000); // 30 minutes in milliseconds

  const currentCipher = ciphers[gameState.currentLevel];
  const isGameComplete = gameState.currentLevel >= ciphers.length;
  const hasGameStarted = gameState.isActive || gameState.completedLevels.length > 0;

  useEffect(() => {
    // Load saved game state
    const savedState = localStorage.getItem(`gameState_${team.id}`);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setGameState(parsed);
    }
  }, [team.id]);

  useEffect(() => {
    // Save game state
    if (hasGameStarted) {
      localStorage.setItem(`gameState_${team.id}`, JSON.stringify(gameState));
      updateLeaderboard();
    }
  }, [gameState, team.id, hasGameStarted]);

  const updateLeaderboard = () => {
    const progress = JSON.parse(localStorage.getItem('ancientScriptsProgress') || '[]');
    const existingIndex = progress.findIndex((p: any) => p.teamId === team.id);
    
    const teamProgress = {
      teamId: team.id,
      teamName: team.name,
      player1: team.player1,
      player2: team.player2,
      levelsCompleted: gameState.completedLevels.length,
      totalPoints: gameState.totalPoints,
      totalTime: gameState.totalTime,
      lastUpdateTime: Date.now(),
    };

    if (existingIndex >= 0) {
      progress[existingIndex] = teamProgress;
    } else {
      progress.push(teamProgress);
    }

    localStorage.setItem('ancientScriptsProgress', JSON.stringify(progress));
  };

  const startGame = () => {
    const now = Date.now();
    setGameState({
      isActive: true,
      currentLevel: 0,
      startTime: now,
      levelStartTime: now,
      completedLevels: [],
      totalPoints: 0,
      totalTime: 0,
    });
    toast({
      title: "Quest Begins!",
      description: "The ancient codes await your decryption skills.",
    });
  };

  const resetGame = () => {
    localStorage.removeItem(`gameState_${team.id}`);
    setGameState({
      isActive: false,
      currentLevel: 0,
      startTime: 0,
      levelStartTime: 0,
      completedLevels: [],
      totalPoints: 0,
      totalTime: 0,
    });
    toast({
      title: "Game Reset",
      description: "Ready to start fresh?",
    });
  };

  const onCipherSolved = (cipher: Cipher, timeTaken: number) => {
    const newCompletedLevels = [...gameState.completedLevels, cipher.id];
    const newTotalTime = gameState.totalTime + timeTaken;
    const newTotalPoints = gameState.totalPoints + cipher.points;
    const newCurrentLevel = gameState.currentLevel + 1;
    const isLastLevel = newCurrentLevel >= ciphers.length - 1;

    setGameState(prev => ({
      ...prev,
      currentLevel: newCurrentLevel,
      levelStartTime: Date.now(),
      completedLevels: newCompletedLevels,
      totalPoints: newTotalPoints,
      totalTime: newTotalTime,
      isActive: !isLastLevel,
    }));

    toast({
      title: `Level ${cipher.level} Complete!`,
      description: `+${cipher.points} points. ${isLastLevel ? 'Congratulations!' : 'Next challenge awaits!'}`,
    });

    if (isLastLevel) {
      toast({
        title: "🎉 Quest Complete!",
        description: `${team.name} has cracked all the ancient codes!`,
      });
    }
  };

  const onTimeUp = () => {
    setGameState(prev => ({ ...prev, isActive: false }));
    toast({
      title: "Time's Up!",
      description: "The ancient scrolls fade into mystery...",
      variant: "destructive",
    });
  };

  if (showLeaderboard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button onClick={() => setShowLeaderboard(false)} variant="outline">
            ← Back to Game
          </Button>
          <Button onClick={onBackToMenu} variant="parchment">
            Main Menu
          </Button>
        </div>
        <Leaderboard currentTeam={team.id} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-parchment border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-ancient rounded-full flex items-center justify-center shadow-glow">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-ancient text-xl font-bold text-glow">{team.name}</h2>
                <p className="font-manuscript text-sm text-muted-foreground">
                  {team.player1} & {team.player2}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {gameState.isActive && (
                <GameTimer
                  initialTime={gameTimeLimit / 1000}
                  onTimeUp={onTimeUp}
                  isActive={true}
                />
              )}
              
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-ancient font-bold text-lg text-primary">
                  {gameState.totalPoints}
                </span>
              </div>

              <Badge variant="secondary" className="font-manuscript">
                Level {gameState.currentLevel + 1}/{ciphers.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button onClick={onBackToMenu} variant="outline">
            ← Main Menu
          </Button>
          <Button 
            onClick={() => setShowLeaderboard(true)} 
            variant="parchment"
            className="flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Leaderboard
          </Button>
        </div>
        
        <div className="flex gap-3">
          {hasGameStarted && (
            <Button onClick={resetGame} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          )}
          {!gameState.isActive && !isGameComplete && (
            <Button onClick={startGame} variant="ancient" size="lg">
              <Play className="w-4 h-4" />
              {hasGameStarted ? 'Continue Quest' : 'Begin Quest'}
            </Button>
          )}
        </div>
      </div>

      {/* Game Content */}
      {!hasGameStarted ? (
        <Card className="w-full max-w-2xl mx-auto shadow-ancient bg-gradient-parchment border-2 border-primary/20">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="font-ancient text-3xl text-glow">Ready to Begin?</CardTitle>
            <CardDescription className="font-manuscript text-lg">
              Six levels of ancient cryptography await. Work together to crack each code 
              before time runs out. Remember: no AI tools allowed!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-muted/20 p-4 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="font-manuscript font-semibold">30 Minutes</p>
                <p className="font-manuscript text-sm text-muted-foreground">Time Limit</p>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-manuscript font-semibold">1,450 Points</p>
                <p className="font-manuscript text-sm text-muted-foreground">Max Score</p>
              </div>
            </div>
            <Button onClick={startGame} variant="ancient" size="xl">
              <Play className="w-5 h-5" />
              Begin Ancient Scripts Quest
            </Button>
          </CardContent>
        </Card>
      ) : isGameComplete ? (
        <Card className="w-full max-w-2xl mx-auto shadow-glow bg-gradient-ancient border-2 border-primary">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="font-ancient text-3xl text-primary-foreground">
              Quest Complete!
            </CardTitle>
            <CardDescription className="font-manuscript text-lg text-primary-foreground/80">
              {team.name} has successfully decoded all ancient scripts!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-primary-foreground/10 p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-ancient font-bold text-primary-foreground">
                    {gameState.totalPoints}
                  </div>
                  <p className="font-manuscript text-primary-foreground/80">Total Points</p>
                </div>
                <div>
                  <div className="text-2xl font-ancient font-bold text-primary-foreground">
                    {Math.floor(gameState.totalTime / 60000)}:{String(Math.floor((gameState.totalTime % 60000) / 1000)).padStart(2, '0')}
                  </div>
                  <p className="font-manuscript text-primary-foreground/80">Completion Time</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowLeaderboard(true)} 
              variant="outline" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              View Final Rankings
            </Button>
          </CardContent>
        </Card>
      ) : currentCipher ? (
        <CipherChallenge
          cipher={currentCipher}
          onSolved={onCipherSolved}
          startTime={gameState.levelStartTime}
        />
      ) : null}
    </div>
  );
};