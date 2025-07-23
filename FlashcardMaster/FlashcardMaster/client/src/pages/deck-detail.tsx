import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Plus, Edit, Trash2, Play, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AddCardModal } from "@/components/modals/add-card-modal";
import { EditCardModal } from "@/components/modals/edit-card-modal";
import { apiRequest } from "@/lib/queryClient";
import { getStatusColor, getDifficultyColor } from "@/lib/spaced-repetition";
import type { Deck, CardWithStatus } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function DeckDetailPage() {
  const { id } = useParams();
  const deckId = parseInt(id || "0");
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);
  const [editCardModalOpen, setEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardWithStatus | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: deck, isLoading: deckLoading } = useQuery<Deck>({
    queryKey: ["/api/decks", deckId],
    enabled: deckId > 0,
  });

  const { data: cards = [], isLoading: cardsLoading } = useQuery<CardWithStatus[]>({
    queryKey: ["/api/decks", deckId, "cards"],
    enabled: deckId > 0,
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId: number) => apiRequest("DELETE", `/api/cards/${cardId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decks", deckId, "cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      toast({ title: "Card deleted successfully!" });
    },
    onError: () => {
      toast({
        title: "Failed to delete card",
        description: "Please try again.",
        variant: "destructive"
      });
    },
  });

  const handleEditCard = (card: CardWithStatus) => {
    setSelectedCard(card);
    setEditCardModalOpen(true);
  };

  const filteredCards = cards.filter(card => {
    switch (filter) {
      case "due":
        return card.status === "due";
      case "new":
        return card.status === "new";
      case "mastered":
        return card.status === "mastered";
      default:
        return true;
    }
  });

  const stats = {
    totalCards: cards.length,
    dueCards: cards.filter(c => c.status === "due").length,
    newCards: cards.filter(c => c.status === "new").length,
    masteredCards: cards.filter(c => c.status === "mastered").length,
  };

  if (deckLoading || cardsLoading) {
    return (
      <div className="animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Deck not found</h2>
        <p className="text-slate-600 mb-4">The deck you're looking for doesn't exist.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Deck Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{deck.name}</h2>
            <p className="text-slate-600">{deck.description || "No description"}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Deck
          </Button>
          <Button onClick={() => setAddCardModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </div>

      {/* Deck Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{stats.totalCards}</div>
            <div className="text-sm text-slate-600">Total Cards</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">{stats.dueCards}</div>
            <div className="text-sm text-slate-600">Due Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{stats.newCards}</div>
            <div className="text-sm text-slate-600">New Cards</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.masteredCards}</div>
            <div className="text-sm text-slate-600">Mastered</div>
          </CardContent>
        </Card>
      </div>

      {/* Cards List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cards</CardTitle>
            <div className="flex items-center space-x-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cards</SelectItem>
                  <SelectItem value="due">Due Today</SelectItem>
                  <SelectItem value="new">New Cards</SelectItem>
                  <SelectItem value="mastered">Mastered</SelectItem>
                </SelectContent>
              </Select>
              {stats.dueCards > 0 && (
                <Link href={`/train/${deckId}`}>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Start Training
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredCards.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-slate-400 text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {filter === "all" ? "No cards yet" : `No ${filter} cards`}
              </h3>
              <p className="text-slate-600 mb-4">
                {filter === "all" 
                  ? "Add your first card to get started!"
                  : `There are no ${filter} cards in this deck.`
                }
              </p>
              {filter === "all" && (
                <Button onClick={() => setAddCardModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Card
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredCards.map((card) => (
                <div key={card.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="font-medium text-slate-900 mb-1">{card.front}</div>
                      <div className="text-sm text-slate-600 line-clamp-2 mb-2">{card.back}</div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(card.status)}>
                          {card.status}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(card.difficulty)}>
                          {card.difficulty}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {card.lastReviewed 
                            ? `Last reviewed: ${new Date(card.lastReviewed).toLocaleDateString()}`
                            : "Never reviewed"
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditCard(card)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteCardMutation.mutate(card.id)}
                        disabled={deleteCardMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddCardModal 
        open={addCardModalOpen} 
        onOpenChange={setAddCardModalOpen}
        deckId={deckId}
      />
      
      {selectedCard && (
        <EditCardModal 
          open={editCardModalOpen} 
          onOpenChange={setEditCardModalOpen}
          card={selectedCard}
          deckId={deckId}
        />
      )}
    </div>
  );
}
