import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Pause, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flashcard } from "@/components/flashcard";
import { useSpacedRepetition } from "@/hooks/use-spaced-repetition";
import { formatTimeSpent } from "@/lib/spaced-repetition";
import type { CardWithStatus, Deck } from "@shared/schema";

export default function TrainerPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const deckId = parseInt(id || "0");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const { rateCard, endSession, sessionStats, isUpdating } = useSpacedRepetition();

  const { data: deck } = useQuery<Deck>({
    queryKey: ["/api/decks", deckId],
    enabled: deckId > 0,
  });

  const { data: dueCards = [], isLoading } = useQuery<CardWithStatus[]>({
    queryKey: ["/api/decks", deckId, "cards", "due"],
    enabled: deckId > 0,
  });

  const currentCard = dueCards[currentCardIndex];
  const isLastCard = currentCardIndex >= dueCards.length - 1;
  const progressPercent = dueCards.length > 0 ? ((currentCardIndex + 1) / dueCards.length) * 100 : 0;

  const handleRateCard = (difficulty: 'Hard' | 'Medium' | 'Easy') => {
    if (!currentCard) return;

    rateCard(currentCard.id, difficulty);

    if (isLastCard) {
      // Session complete - end session and redirect
      const timeSpentSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
      // Convert to minutes for more meaningful tracking, minimum 1 minute
      const timeSpentMinutes = Math.max(1, Math.floor(timeSpentSeconds / 60));
      endSession(deckId, sessionStats.cardsStudied + 1, sessionStats.correctAnswers + (difficulty !== 'Hard' ? 1 : 0), timeSpentMinutes * 60);
      setLocation("/");
    } else {
      // Move to next card
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handleEndSession = () => {
    endSession(deckId);
    setLocation("/");
  };

  useEffect(() => {
    if (!isLoading && dueCards.length === 0) {
      // No cards due, redirect back
      setLocation(`/deck/${deckId}`);
    }
  }, [dueCards.length, isLoading, deckId, setLocation]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-8"></div>
          <div className="h-2 bg-slate-200 rounded mb-8"></div>
          <div className="h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-8 w-8 text-secondary" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">All caught up!</h2>
        <p className="text-slate-600 mb-4">No cards are due for review right now.</p>
        <Button onClick={() => setLocation(`/deck/${deckId}`)}>
          Back to Deck
        </Button>
      </div>
    );
  }

  // Session complete state
  if (isLastCard && sessionStats.cardsStudied > 0) {
    const timeSpent = Math.round((Date.now() - sessionStartTime) / 1000);
    const accuracy = sessionStats.cardsStudied > 0 
      ? Math.round((sessionStats.correctAnswers / sessionStats.cardsStudied) * 100) 
      : 0;

    return (
      <div className="max-w-md mx-auto text-center animate-fade-in">
        <Card>
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-8 w-8 text-secondary" />
            </div>
            
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Great job!</h3>
            <p className="text-slate-600 mb-6">You've completed today's training session.</p>
            
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Cards studied:</span>
                <span className="font-medium">{sessionStats.cardsStudied}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Accuracy:</span>
                <span className="font-medium text-secondary">{accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Time spent:</span>
                <span className="font-medium">{formatTimeSpent(timeSpent)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full" onClick={() => setLocation("/")}>
                Continue Learning
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setLocation("/progress")}>
                View Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Training Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation(`/deck/${deckId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{deck?.name}</h2>
            <p className="text-slate-600">
              Card {currentCardIndex + 1} of {dueCards.length} due today
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-600">
            {sessionStats.cardsStudied} studied
          </div>
          <Button variant="ghost" size="icon" onClick={handleEndSession}>
            <Pause className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercent} className="mb-8" />

      {/* Flashcard */}
      {currentCard && (
        <Flashcard
          card={currentCard}
          onRate={handleRateCard}
          showDifficultyButtons={true}
        />
      )}

      {isUpdating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-slate-600">Updating card...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
