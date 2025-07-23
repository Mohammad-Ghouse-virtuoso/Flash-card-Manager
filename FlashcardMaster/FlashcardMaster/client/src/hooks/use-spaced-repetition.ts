import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { calculateNextReviewDate, type Difficulty } from '@/lib/spaced-repetition';
import type { Card } from '@shared/schema';

export function useSpacedRepetition() {
  const queryClient = useQueryClient();
  const [sessionStats, setSessionStats] = useState({
    cardsStudied: 0,
    correctAnswers: 0,
    startTime: Date.now(),
  });

  const updateCardMutation = useMutation({
    mutationFn: async ({ cardId, difficulty }: { cardId: number; difficulty: Difficulty }) => {
      const card = await apiRequest('GET', `/api/cards/${cardId}`).then(res => res.json()) as Card;
      
      const nextReviewDate = calculateNextReviewDate(difficulty);
      const isCorrect = difficulty !== 'Hard';
      
      const updatedCard = {
        ...card,
        lastReviewed: new Date(),
        nextReviewDate,
        timesReviewed: (card.timesReviewed || 0) + 1,
        correctCount: (card.correctCount || 0) + (isCorrect ? 1 : 0),
        difficulty,
      };

      return apiRequest('PUT', `/api/cards/${cardId}`, updatedCard);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/decks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
    },
  });

  const createStudySessionMutation = useMutation({
    mutationFn: async (data: { deckId: number; cardsStudied: number; correctAnswers: number; timeSpent: number }) => {
      return apiRequest('POST', '/api/study-sessions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/decks'] });
    },
  });

  const rateCard = useCallback((cardId: number, difficulty: Difficulty) => {
    updateCardMutation.mutate({ cardId, difficulty });
    
    setSessionStats(prev => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: prev.correctAnswers + (difficulty !== 'Hard' ? 1 : 0),
    }));
  }, [updateCardMutation]);

  const endSession = useCallback((deckId: number, cardsStudied?: number, correctAnswers?: number, timeSpent?: number) => {
    const sessionTimeSeconds = Math.round((Date.now() - sessionStats.startTime) / 1000);
    // Use provided timeSpent or calculate realistic time (minimum 30 seconds per card)
    const finalTimeSpent = timeSpent || Math.max(30 * (cardsStudied || sessionStats.cardsStudied), sessionTimeSeconds);
    const finalCardsStudied = cardsStudied || sessionStats.cardsStudied;
    const finalCorrectAnswers = correctAnswers || sessionStats.correctAnswers;
    
    createStudySessionMutation.mutate({
      deckId,
      cardsStudied: finalCardsStudied,
      correctAnswers: finalCorrectAnswers,
      timeSpent: finalTimeSpent,
    });

    // Reset session stats
    setSessionStats({
      cardsStudied: 0,
      correctAnswers: 0,
      startTime: Date.now(),
    });
  }, [sessionStats, createStudySessionMutation]);

  return {
    rateCard,
    endSession,
    sessionStats,
    isUpdating: updateCardMutation.isPending,
  };
}
