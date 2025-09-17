import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Clock, Target } from 'lucide-react';

interface TeamProgress {
  teamId: string;
  teamName: string;
  player1: string;
  player2: string;
  levelsCompleted: number;
  totalPoints: number;
  totalTime: number;
  lastUpdateTime: number;
}

interface LeaderboardProps {
  currentTeam?: string;
}

export const Leaderboard = ({ currentTeam }: LeaderboardProps) => {
  const [teams, setTeams] = useState<TeamProgress[]>([]);

  useEffect(() => {
    const loadTeamProgress = () => {
      const progress = JSON.parse(localStorage.getItem('ancientScriptsProgress') || '[]');
      const sortedTeams = progress.sort((a: TeamProgress, b: TeamProgress) => {
        // Sort by levels completed first, then by time taken
        if (b.levelsCompleted !== a.levelsCompleted) {
          return b.levelsCompleted - a.levelsCompleted;
        }
        return a.totalTime - b.totalTime;
      });
      setTeams(sortedTeams);
    };

    loadTeamProgress();
    
    // Update every 5 seconds for real-time feel
    const interval = setInterval(loadTeamProgress, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'border-yellow-400/50 bg-yellow-400/5';
      case 2: return 'border-gray-400/50 bg-gray-400/5';
      case 3: return 'border-amber-600/50 bg-amber-600/5';
      default: return 'border-border';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-ancient bg-gradient-parchment border-2 border-primary/20">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-ancient rounded-full flex items-center justify-center shadow-glow">
          <Trophy className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="font-ancient text-3xl text-glow">Ancient Scripts Leaderboard</CardTitle>
        <CardDescription className="font-manuscript text-base">
          Teams ranked by levels cracked and speed of decryption
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {teams.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Target className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="font-manuscript text-lg text-muted-foreground">
              No teams have started the challenge yet.
            </p>
            <p className="font-manuscript text-sm text-muted-foreground mt-2">
              Be the first to crack the ancient codes!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team, index) => (
              <div
                key={team.teamId}
                className={`p-4 rounded-lg border-2 transition-all ${getRankColor(index + 1)} ${
                  team.teamId === currentTeam ? 'ring-2 ring-primary/50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-ancient text-lg font-semibold">
                          {team.teamName}
                        </h3>
                        {team.teamId === currentTeam && (
                          <Badge variant="secondary" className="text-xs">Your Team</Badge>
                        )}
                      </div>
                      
                      <p className="font-manuscript text-sm text-muted-foreground">
                        {team.player1} & {team.player2}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="flex items-center gap-1 text-primary">
                        <Target className="w-4 h-4" />
                        <span className="font-ancient font-bold text-lg">
                          {team.levelsCompleted}
                        </span>
                      </div>
                      <p className="font-manuscript text-xs text-muted-foreground">
                        levels
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-accent">
                        <Clock className="w-4 h-4" />
                        <span className="font-manuscript font-semibold">
                          {formatTime(team.totalTime)}
                        </span>
                      </div>
                      <p className="font-manuscript text-xs text-muted-foreground">
                        time
                      </p>
                    </div>

                    <div>
                      <div className="text-primary font-ancient font-bold text-lg">
                        {team.totalPoints}
                      </div>
                      <p className="font-manuscript text-xs text-muted-foreground">
                        points
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
          <p className="font-manuscript text-sm text-muted-foreground text-center">
            🏆 Rankings update in real-time based on levels completed and total solving time
          </p>
        </div>
      </CardContent>
    </Card>
  );
};