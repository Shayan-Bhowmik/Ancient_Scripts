import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollText, Key, CheckCircle, XCircle } from 'lucide-react';

export interface Cipher {
  id: string;
  type: 'caesar' | 'morse' | 'atbash' | 'pigpen' | 'substitution';
  level: number;
  title: string;
  description: string;
  encryptedMessage: string;
  correctAnswer: string;
  hint?: string;
  points: number;
}

interface CipherChallengeProps {
  cipher: Cipher;
  onSolved: (cipher: Cipher, timeTaken: number) => void;
  startTime: number;
}

export const CipherChallenge = ({ cipher, onSolved, startTime }: CipherChallengeProps) => {
  // Reset state when cipher changes (new level)
  useEffect(() => {
    setAnswer('');
    setAttempts(0);
    setShowHint(false);
    setFeedback(null);
  }, [cipher]);
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = cipher.correctAnswer.toLowerCase();

    setAttempts(prev => {
      const next = prev + 1;
      // Show hint after 2 failed attempts
      if (normalizedAnswer !== normalizedCorrect && next >= 2 && cipher.hint) {
        setShowHint(true);
      }
      return next;
    });

    if (normalizedAnswer === normalizedCorrect) {
      setFeedback('correct');
      const timeTaken = Date.now() - startTime;
      setTimeout(() => {
        onSolved(cipher, timeTaken);
      }, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const getCipherIcon = () => {
    switch (cipher.type) {
      case 'caesar': return '🏛️';
      case 'morse': return '📡';
      case 'atbash': return '🔤';
      case 'pigpen': return '🐷';
      case 'substitution': return '🔀';
      default: return '🔐';
    }
  };

  const getCipherTypeDescription = () => {
    switch (cipher.type) {
      case 'caesar': return 'Each letter is shifted by a fixed number of positions';
      case 'morse': return 'Dots and dashes representing letters';
      case 'atbash': return 'A=Z, B=Y, C=X... reverse alphabet substitution';
      case 'pigpen': return 'Letters represented by symbols and dots';
      case 'substitution': return 'Each letter is replaced by another letter';
      default: return 'Decode the ancient message';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-cipher bg-card border-2 border-accent/30">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getCipherIcon()}</div>
            <div>
              <CardTitle className="font-ancient text-xl text-glow">
                Level {cipher.level}: {cipher.title}
              </CardTitle>
              <CardDescription className="font-manuscript">
                {getCipherTypeDescription()}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="font-manuscript">
            {cipher.points} points
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-manuscript font-semibold text-muted-foreground flex items-center gap-2">
            <ScrollText className="w-4 h-4" />
            Encrypted Message
          </label>
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <code className="font-mono text-lg text-center block tracking-wider">
              {cipher.encryptedMessage}
            </code>
          </div>
        </div>

        {cipher.description && (
          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <p className="font-manuscript text-sm text-muted-foreground">
              {cipher.description}
            </p>
          </div>
        )}

        {showHint && cipher.hint && (
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 animate-in slide-in-from-top">
            <div className="flex items-start gap-2">
              <Key className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-manuscript text-sm font-semibold text-primary mb-1">Hint:</p>
                <p className="font-manuscript text-sm text-muted-foreground">{cipher.hint}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-manuscript font-semibold text-muted-foreground">
              Your Answer
            </label>
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the decoded message..."
              className="font-manuscript text-lg bg-input/50 border-border focus:border-primary"
              disabled={feedback === 'correct'}
            />
          </div>

          {feedback && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              feedback === 'correct' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-destructive/10 border border-destructive/20 text-destructive'
            }`}>
              {feedback === 'correct' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-manuscript font-semibold">
                {feedback === 'correct' ? 'Excellent! Code cracked!' : 'Incorrect. Try again!'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-manuscript text-muted-foreground">
              Attempts: {attempts}
            </span>
            <Button
              type="submit"
              variant="cipher"
              disabled={!answer.trim() || feedback === 'correct'}
            >
              Decode Message
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};