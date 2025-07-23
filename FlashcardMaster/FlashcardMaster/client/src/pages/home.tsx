import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Flame, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeckCard } from "@/components/deck-card";
import { CreateDeckModal } from "@/components/modals/create-deck-modal";
import type { DeckWithStats } from "@shared/schema";

export default function HomePage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data: decks = [], isLoading } = useQuery<DeckWithStats[]>({
    queryKey: ["/api/decks"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  }) as { data: { streak: number; cardsStudiedToday: number; accuracy: number; timeSpent: number; totalCards: number } | undefined };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-4"></div>
              <div className="h-3 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Master Any Subject with Spaced Repetition
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Create flashcard decks, train with intelligent spacing, and track your learning progress.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats?.streak || 0}</p>
                <p className="text-sm text-slate-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats?.cardsStudiedToday || 0}</p>
                <p className="text-sm text-slate-600">Cards Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats?.accuracy || 0}%</p>
                <p className="text-sm text-slate-600">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decks Section */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-slate-900">Your Decks</h3>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Deck
        </Button>
      </div>

      {/* Deck Grid */}
      {decks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-slate-400 text-3xl">📚</div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No decks yet</h3>
          <p className="text-slate-600 mb-6">Create your first flashcard deck to start learning!</p>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Deck
          </Button>
        </div>
      )}

      <CreateDeckModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen} 
      />
    </div>
  );
}
