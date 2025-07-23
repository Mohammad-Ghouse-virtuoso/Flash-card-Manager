import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const decks = pgTable("decks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").default("Other"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  difficulty: text("difficulty").default("Medium"), // Easy, Medium, Hard
  tags: text("tags"), // comma-separated
  nextReviewDate: timestamp("next_review_date").defaultNow(),
  lastReviewed: timestamp("last_reviewed"),
  timesReviewed: integer("times_reviewed").default(0),
  correctCount: integer("correct_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").notNull(),
  cardsStudied: integer("cards_studied").default(0),
  correctAnswers: integer("correct_answers").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDeckSchema = createInsertSchema(decks).omit({
  id: true,
  createdAt: true,
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  nextReviewDate: true,
  lastReviewed: true,
  timesReviewed: true,
  correctCount: true,
  createdAt: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  createdAt: true,
});

export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type Deck = typeof decks.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type StudySession = typeof studySessions.$inferSelect;

// Additional types for frontend
export type DeckWithStats = Deck & {
  totalCards: number;
  dueCards: number;
  newCards: number;
  masteredCards: number;
  lastStudied?: string;
  progress: number;
};

export type CardWithStatus = Card & {
  status: 'new' | 'due' | 'learning' | 'mastered';
  isOverdue: boolean;
};
