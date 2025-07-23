import { Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import type { DeckWithStats } from "@shared/schema";

interface DeckCardProps {
  deck: DeckWithStats;
}

export function DeckCard({ deck }: DeckCardProps) {
  const getIconForCategory = (category: string = "Other") => {
    switch (category.toLowerCase()) {
      case 'programming':
        return '💻';
      case 'language learning':
        return '🌐';
      case 'science':
        return '⚛️';
      case 'history':
        return '📚';
      case 'mathematics':
        return '🔢';
      default:
        return '📝';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <Link href={`/deck/${deck.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
              {getIconForCategory(deck.category || undefined)}
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <h4 className="text-lg font-semibold text-slate-900 mb-2">{deck.name}</h4>
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{deck.description || "No description"}</p>
          
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-slate-500">{deck.totalCards} cards</span>
              {deck.dueCards > 0 && (
                <span className="text-red-600 font-medium">{deck.dueCards} due today</span>
              )}
              {deck.masteredCards > 0 && (
                <span className="text-green-600 font-medium">{deck.masteredCards} mastered</span>
              )}
            </div>
            {deck.lastStudied && (
              <span className="text-slate-400">{deck.lastStudied}</span>
            )}
          </div>
          
          <div>
            <Progress value={deck.progress} className="h-2" />
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="px-6 py-4 bg-slate-50 rounded-b-xl">
        <Link href={`/train/${deck.id}`} className="w-full">
          <Button className="w-full" disabled={deck.dueCards === 0}>
            <Play className="h-4 w-4 mr-2" />
            {deck.dueCards > 0 ? "Start Training" : deck.masteredCards > 0 ? "Review Mastered" : "No cards due"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
