import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MousePointer } from "lucide-react";
import type { CardWithStatus } from "@shared/schema";

interface FlashcardProps {
  card: CardWithStatus;
  onRate?: (difficulty: 'Hard' | 'Medium' | 'Easy') => void;
  showDifficultyButtons?: boolean;
}

export function Flashcard({ card, onRate, showDifficultyButtons = true }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (difficulty: 'Hard' | 'Medium' | 'Easy') => {
    onRate?.(difficulty);
    setIsFlipped(false); // Reset for next card
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`card-flip h-96 mb-8 ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="card-flip-inner relative w-full h-full">
          {/* Card Front */}
          <Card className="card-front absolute inset-0 shadow-lg cursor-pointer">
            <CardContent className="p-8 flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-xl font-medium text-slate-900 mb-4">{card.front}</p>
                {!isFlipped && (
                  <div className="text-sm text-slate-500 flex items-center justify-center">
                    <MousePointer className="h-4 w-4 mr-2" />
                    Click to reveal answer
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card Back */}
          <Card className="card-back absolute inset-0 shadow-lg cursor-pointer">
            <CardContent className="p-8 flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg text-slate-900 leading-relaxed">{card.back}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Difficulty Buttons */}
      {isFlipped && showDifficultyButtons && (
        <div className="animate-slide-up">
          <p className="text-center text-slate-600 mb-6">How well did you know this?</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="bg-red-50 border-red-200 text-red-700 py-4 px-6 h-auto hover:bg-red-100"
              onClick={() => handleRate('Hard')}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">❌</div>
                <div className="font-semibold">Hard</div>
                <div className="text-sm opacity-75">Study tomorrow</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="bg-amber-50 border-amber-200 text-amber-700 py-4 px-6 h-auto hover:bg-amber-100"
              onClick={() => handleRate('Medium')}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🕒</div>
                <div className="font-semibold">Medium</div>
                <div className="text-sm opacity-75">Study in 2 days</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="bg-green-50 border-green-200 text-green-700 py-4 px-6 h-auto hover:bg-green-100"
              onClick={() => handleRate('Easy')}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold">Easy</div>
                <div className="text-sm opacity-75">Study in 4 days</div>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
