import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  player1: string;
  player2: string;
  createdAt: number;
}

interface TeamRegistrationProps {
  onTeamCreated: (team: Team) => void;
}

export const TeamRegistration = ({ onTeamCreated }: TeamRegistrationProps) => {
  const [teamName, setTeamName] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !player1.trim() || !player2.trim()) return;

    setIsLoading(true);
    
    const newTeam: Team = {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: teamName.trim(),
      player1: player1.trim(),
      player2: player2.trim(),
      createdAt: Date.now(),
    };

    // Save to localStorage
    const existingTeams = JSON.parse(localStorage.getItem('ancientScriptsTeams') || '[]');
    existingTeams.push(newTeam);
    localStorage.setItem('ancientScriptsTeams', JSON.stringify(existingTeams));

    setTimeout(() => {
      onTeamCreated(newTeam);
      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-ancient bg-gradient-parchment border-2 border-primary/20">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-ancient rounded-full flex items-center justify-center shadow-glow">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="font-ancient text-2xl text-glow">Assemble Your Team</CardTitle>
        <CardDescription className="font-manuscript text-base">
          Ancient Scripts requires exactly 2 cryptographers per team. Choose your cipher-breaking partner wisely.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-manuscript font-semibold text-muted-foreground">
              Team Name
            </label>
            <Input
              placeholder="The Code Breakers"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="font-manuscript bg-input/50 border-border focus:border-primary"
              maxLength={30}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-manuscript font-semibold text-muted-foreground">
              <Users className="w-4 h-4" />
              Team Members
            </div>
            
            <div className="space-y-3">
              <Input
                placeholder="First Cryptographer"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                className="font-manuscript bg-input/50 border-border focus:border-primary"
                maxLength={25}
              />
              <Input
                placeholder="Second Cryptographer"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                className="font-manuscript bg-input/50 border-border focus:border-primary"
                maxLength={25}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="ancient"
            size="lg"
            className="w-full"
            disabled={!teamName.trim() || !player1.trim() || !player2.trim() || isLoading}
          >
            {isLoading ? 'Creating Team...' : 'Begin the Quest'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};