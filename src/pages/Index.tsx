import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeamRegistration } from '@/components/TeamRegistration';
import { GameInterface } from '@/components/GameInterface';
import { Leaderboard } from '@/components/Leaderboard';
import { Scroll, Clock, Users, Target, Shield, Zap, BookOpen } from 'lucide-react';
import heroImage from '@/assets/ancient-scripts-hero.jpg';

interface Team {
  id: string;
  name: string;
  player1: string;
  player2: string;
  createdAt: number;
}

type GameMode = 'landing' | 'register' | 'game' | 'leaderboard';

const Index = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>('landing');
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  const handleTeamCreated = (team: Team) => {
    setCurrentTeam(team);
    setCurrentMode('game');
  };

  const handleBackToMenu = () => {
    setCurrentMode('landing');
    setCurrentTeam(null);
  };

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time-Pressured Racing",
      description: "30 minutes to crack all codes. Speed and accuracy determine victory."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team-Based Challenges",
      description: "Exactly 2 cryptographers per team. Collaboration is key to success."
    },
    {
      icon: <Scroll className="w-6 h-6" />,
      title: "Ancient Cipher Types",
      description: "Caesar, Morse, Atbash, Pigpen, and complex substitution puzzles."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Real-Time Leaderboard",
      description: "Live rankings based on levels completed and solving speed."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "No AI Assistance",
      description: "Pure human intelligence, pen, paper, and logical reasoning only."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Progressive Difficulty",
      description: "Six levels culminating in a multi-cipher ultimate challenge."
    }
  ];

  if (currentMode === 'register') {
    return (
      <div className="min-h-screen bg-background cipher-pattern">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={() => setCurrentMode('landing')} variant="outline">
              ← Back to Home
            </Button>
            <Button onClick={() => setCurrentMode('leaderboard')} variant="parchment">
              View Leaderboard
            </Button>
          </div>
          <TeamRegistration onTeamCreated={handleTeamCreated} />
        </div>
      </div>
    );
  }

  if (currentMode === 'game' && currentTeam) {
    return (
      <div className="min-h-screen bg-background cipher-pattern">
        <div className="container mx-auto px-4 py-8">
          <GameInterface team={currentTeam} onBackToMenu={handleBackToMenu} />
        </div>
      </div>
    );
  }

  if (currentMode === 'leaderboard') {
    return (
      <div className="min-h-screen bg-background cipher-pattern">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={() => setCurrentMode('landing')} variant="outline">
              ← Back to Home
            </Button>
            <Button onClick={() => setCurrentMode('register')} variant="ancient">
              Join Challenge
            </Button>
          </div>
          <Leaderboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="font-manuscript text-sm px-4 py-2">
                Cryptography Challenge
              </Badge>
              <h1 className="font-ancient text-5xl md:text-7xl font-bold text-glow">
                Ancient Scripts
              </h1>
              <p className="font-manuscript text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Race against time to decode mysterious ciphers and uncover hidden messages. 
                Where teamwork meets ancient cryptography.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setCurrentMode('register')} 
                variant="ancient" 
                size="xl"
                className="font-semibold"
              >
                <Users className="w-5 h-5" />
                Form Your Team
              </Button>
              <Button 
                onClick={() => setCurrentMode('leaderboard')} 
                variant="cipher" 
                size="xl"
              >
                <Target className="w-5 h-5" />
                View Leaderboard
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-3xl font-ancient font-bold text-primary">30</div>
                <p className="font-manuscript text-sm text-muted-foreground">Minutes Time Limit</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-ancient font-bold text-primary">6</div>
                <p className="font-manuscript text-sm text-muted-foreground">Cipher Challenges</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-ancient font-bold text-primary">2</div>
                <p className="font-manuscript text-sm text-muted-foreground">Players Per Team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 cipher-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="font-ancient text-3xl md:text-4xl font-bold text-glow">
                The Challenge Awaits
              </h2>
              <p className="font-manuscript text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover what makes Ancient Scripts the ultimate test of cryptographic skill and teamwork
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-cipher bg-card/80 backdrop-blur-sm border-2 border-accent/20 hover:border-accent/40 transition-all hover:shadow-glow">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-copper rounded-lg flex items-center justify-center text-accent-foreground">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-ancient text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-manuscript text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-ancient bg-gradient-parchment border-2 border-primary/20">
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-ancient rounded-full flex items-center justify-center shadow-glow">
                  <BookOpen className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="font-ancient text-3xl text-glow">The Sacred Rules</CardTitle>
                <CardDescription className="font-manuscript text-lg">
                  Honor these ancient laws of cryptographic competition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-ancient text-xl font-semibold text-primary">Team Formation</h3>
                    <ul className="space-y-2 font-manuscript text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Exactly 2 members per team required
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Both players must work together
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Choose your partner wisely
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-ancient text-xl font-semibold text-primary">Competition Rules</h3>
                    <ul className="space-y-2 font-manuscript text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        30-minute time limit strictly enforced
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        No AI or automated solvers allowed
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Only browser, pen, and paper permitted
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-ancient text-xl font-semibold text-primary">Victory Conditions</h3>
                    <ul className="space-y-2 font-manuscript text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Ranked by levels completed first
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Speed breaks ties between teams
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Final level combines all cipher types
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-ancient text-xl font-semibold text-primary">The Ciphers</h3>
                    <ul className="space-y-2 font-manuscript text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Caesar shift, Morse code, Atbash
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Pigpen cipher, substitution puzzles
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Ultimate multi-cipher final challenge
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 cipher-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-ancient text-4xl font-bold text-glow">
              Ready to Decode the Ancient Mysteries?
            </h2>
            <p className="font-manuscript text-xl text-muted-foreground">
              Form your team of cryptographers and embark on the ultimate cipher-breaking adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setCurrentMode('register')} 
                variant="ancient" 
                size="xl"
                className="font-semibold"
              >
                <Shield className="w-5 h-5" />
                Begin Your Quest
              </Button>
              <Button 
                onClick={() => setCurrentMode('leaderboard')} 
                variant="outline" 
                size="xl"
              >
                <Target className="w-5 h-5" />
                See Current Rankings
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
