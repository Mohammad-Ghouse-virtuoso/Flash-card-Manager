import { decks, cards, studySessions, type Deck, type Card, type StudySession, type InsertDeck, type InsertCard, type InsertStudySession, type DeckWithStats, type CardWithStatus } from "@shared/schema";

export interface IStorage {
  // Deck operations
  getDecks(): Promise<DeckWithStats[]>;
  getDeck(id: number): Promise<Deck | undefined>;
  createDeck(deck: InsertDeck): Promise<Deck>;
  updateDeck(id: number, deck: Partial<InsertDeck>): Promise<Deck | undefined>;
  deleteDeck(id: number): Promise<boolean>;

  // Card operations
  getCards(deckId: number): Promise<CardWithStatus[]>;
  getCard(id: number): Promise<Card | undefined>;
  getDueCards(deckId: number): Promise<CardWithStatus[]>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: number, card: Partial<Card>): Promise<Card | undefined>;
  deleteCard(id: number): Promise<boolean>;

  // Study session operations
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  getStudySessions(deckId?: number): Promise<StudySession[]>;
  getStudyStats(): Promise<{
    totalCards: number;
    streak: number;
    accuracy: number;
    timeSpent: number;
    cardsStudiedToday: number;
  }>;
}

export class MemStorage implements IStorage {
  private decks: Map<number, Deck>;
  private cards: Map<number, Card>;
  private studySessions: Map<number, StudySession>;
  private currentDeckId: number;
  private currentCardId: number;
  private currentSessionId: number;

  constructor() {
    this.decks = new Map();
    this.cards = new Map();
    this.studySessions = new Map();
    this.currentDeckId = 1;
    this.currentCardId = 1;
    this.currentSessionId = 1;
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Programming Decks
    const jsDeck = this.createDeckSync({ name: "JavaScript Fundamentals", description: "Core JavaScript concepts and syntax", category: "Programming" });
    const pythonDeck = this.createDeckSync({ name: "Python Basics", description: "Python fundamentals for beginners", category: "Programming" });
    const reactDeck = this.createDeckSync({ name: "React Concepts", description: "Essential React hooks and patterns", category: "Programming" });

    // Language Learning Decks
    const spanishDeck = this.createDeckSync({ name: "Spanish Vocabulary", description: "Common Spanish words and phrases", category: "Language Learning" });
    const frenchDeck = this.createDeckSync({ name: "French Grammar", description: "Basic French grammar rules", category: "Language Learning" });
    const germanDeck = this.createDeckSync({ name: "German Basics", description: "Essential German vocabulary", category: "Language Learning" });

    // Mathematics Decks
    const algebraDeck = this.createDeckSync({ name: "Algebra Fundamentals", description: "Basic algebraic operations and formulas", category: "Mathematics" });
    const calcDeck = this.createDeckSync({ name: "Calculus Basics", description: "Derivatives and integrals", category: "Mathematics" });
    const statsDeck = this.createDeckSync({ name: "Statistics", description: "Probability and statistical concepts", category: "Mathematics" });

    // JavaScript cards
    this.createCardSync({ deckId: jsDeck.id, front: "What is the difference between let and var?", back: "let has block scope and cannot be redeclared in the same scope, while var has function scope and can be redeclared. let also has temporal dead zone.", difficulty: "Medium", tags: "variables, scope" });
    this.createCardSync({ deckId: jsDeck.id, front: "What is a closure in JavaScript?", back: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.", difficulty: "Hard", tags: "functions, scope" });
    this.createCardSync({ deckId: jsDeck.id, front: "What is the difference between == and ===?", back: "== performs type coercion and compares values, while === compares both type and value without coercion (strict equality).", difficulty: "Easy", tags: "operators, comparison" });
    this.createCardSync({ deckId: jsDeck.id, front: "What is hoisting?", back: "Hoisting is JavaScript's behavior of moving declarations to the top of their containing scope during compilation.", difficulty: "Medium", tags: "hoisting, declarations" });
    this.createCardSync({ deckId: jsDeck.id, front: "What is the purpose of async/await?", back: "async/await provides a cleaner way to work with promises, making asynchronous code look and behave more like synchronous code.", difficulty: "Medium", tags: "async, promises" });

    // Python cards
    this.createCardSync({ deckId: pythonDeck.id, front: "What is a list comprehension?", back: "A concise way to create lists using the syntax: [expression for item in iterable if condition]", difficulty: "Medium", tags: "lists, comprehension" });
    this.createCardSync({ deckId: pythonDeck.id, front: "What is the difference between a list and a tuple?", back: "Lists are mutable (can be changed) and use [], while tuples are immutable (cannot be changed) and use ().", difficulty: "Easy", tags: "data types, mutability" });
    this.createCardSync({ deckId: pythonDeck.id, front: "What is a dictionary in Python?", back: "A collection of key-value pairs that is unordered, changeable, and indexed. Uses {} syntax.", difficulty: "Easy", tags: "data types, dictionary" });
    this.createCardSync({ deckId: pythonDeck.id, front: "What is the difference between range() and xrange()?", back: "range() returns a list (Python 2) or range object (Python 3), while xrange() (Python 2 only) returns an iterator that generates values on demand.", difficulty: "Hard", tags: "functions, iteration" });
    this.createCardSync({ deckId: pythonDeck.id, front: "What is a lambda function?", back: "A small anonymous function defined with the lambda keyword. Syntax: lambda arguments: expression", difficulty: "Medium", tags: "functions, lambda" });

    // React cards
    this.createCardSync({ deckId: reactDeck.id, front: "What is the useState hook?", back: "A React hook that lets you add state to functional components. Returns [state, setState] array.", difficulty: "Easy", tags: "hooks, state" });
    this.createCardSync({ deckId: reactDeck.id, front: "When does useEffect run?", back: "By default, useEffect runs after every render. You can control this with a dependency array as the second argument.", difficulty: "Medium", tags: "hooks, effects" });
    this.createCardSync({ deckId: reactDeck.id, front: "What is props drilling?", back: "Passing props through multiple component layers to reach a deeply nested child component that needs the data.", difficulty: "Medium", tags: "props, patterns" });
    this.createCardSync({ deckId: reactDeck.id, front: "What is the virtual DOM?", back: "A JavaScript representation of the real DOM kept in memory and synced with the real DOM through reconciliation.", difficulty: "Hard", tags: "virtual dom, performance" });
    this.createCardSync({ deckId: reactDeck.id, front: "What is JSX?", back: "A syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.", difficulty: "Easy", tags: "jsx, syntax" });

    // Spanish cards
    this.createCardSync({ deckId: spanishDeck.id, front: "How do you say 'hello' in Spanish?", back: "Hola", difficulty: "Easy", tags: "greetings, basic" });
    this.createCardSync({ deckId: spanishDeck.id, front: "What does 'gracias' mean?", back: "Thank you", difficulty: "Easy", tags: "courtesy, basic" });
    this.createCardSync({ deckId: spanishDeck.id, front: "How do you say 'Where is the bathroom?'", back: "¿Dónde está el baño?", difficulty: "Medium", tags: "questions, travel" });
    this.createCardSync({ deckId: spanishDeck.id, front: "What is the difference between 'ser' and 'estar'?", back: "Both mean 'to be' - 'ser' for permanent characteristics, 'estar' for temporary states and location.", difficulty: "Hard", tags: "verbs, grammar" });
    this.createCardSync({ deckId: spanishDeck.id, front: "How do you say 'I don't understand'?", back: "No entiendo", difficulty: "Medium", tags: "communication, useful" });

    // French cards
    this.createCardSync({ deckId: frenchDeck.id, front: "What are the French definite articles?", back: "le (masculine), la (feminine), les (plural)", difficulty: "Easy", tags: "articles, grammar" });
    this.createCardSync({ deckId: frenchDeck.id, front: "How do you form the past tense (passé composé)?", back: "avoir/être + past participle (j'ai mangé, je suis allé)", difficulty: "Hard", tags: "tenses, grammar" });
    this.createCardSync({ deckId: frenchDeck.id, front: "What does 'Ça va?' mean?", back: "How are you? / How's it going?", difficulty: "Easy", tags: "greetings, informal" });
    this.createCardSync({ deckId: frenchDeck.id, front: "When do you use 'être' instead of 'avoir' in passé composé?", back: "With movement verbs (aller, venir, partir, etc.) and reflexive verbs.", difficulty: "Hard", tags: "auxiliary verbs, grammar" });
    this.createCardSync({ deckId: frenchDeck.id, front: "How do you say 'Excuse me' in French?", back: "Excusez-moi (formal) or Pardon (informal)", difficulty: "Medium", tags: "courtesy, useful" });

    // German cards
    this.createCardSync({ deckId: germanDeck.id, front: "What are the German cases?", back: "Nominativ, Akkusativ, Dativ, Genitiv", difficulty: "Medium", tags: "cases, grammar" });
    this.createCardSync({ deckId: germanDeck.id, front: "How do you say 'thank you' in German?", back: "Danke (informal) or Vielen Dank (formal)", difficulty: "Easy", tags: "courtesy, basic" });
    this.createCardSync({ deckId: germanDeck.id, front: "What is the definite article for feminine nouns in nominative?", back: "die", difficulty: "Easy", tags: "articles, gender" });
    this.createCardSync({ deckId: germanDeck.id, front: "How do German separable verbs work?", back: "The prefix separates and goes to the end of the sentence in present tense (ich stehe auf)", difficulty: "Hard", tags: "verbs, word order" });
    this.createCardSync({ deckId: germanDeck.id, front: "What does 'Wie geht es Ihnen?' mean?", back: "How are you? (formal)", difficulty: "Medium", tags: "greetings, formal" });

    // Algebra cards
    this.createCardSync({ deckId: algebraDeck.id, front: "What is the quadratic formula?", back: "x = (-b ± √(b² - 4ac)) / 2a", difficulty: "Medium", tags: "formulas, quadratic" });
    this.createCardSync({ deckId: algebraDeck.id, front: "What does FOIL stand for?", back: "First, Outer, Inner, Last - method for multiplying binomials", difficulty: "Easy", tags: "multiplication, binomials" });
    this.createCardSync({ deckId: algebraDeck.id, front: "What is the slope-intercept form?", back: "y = mx + b, where m is slope and b is y-intercept", difficulty: "Easy", tags: "linear equations, graphing" });
    this.createCardSync({ deckId: algebraDeck.id, front: "How do you factor x² - 9?", back: "(x + 3)(x - 3) - difference of squares pattern", difficulty: "Medium", tags: "factoring, patterns" });
    this.createCardSync({ deckId: algebraDeck.id, front: "What is the distributive property?", back: "a(b + c) = ab + ac", difficulty: "Easy", tags: "properties, distribution" });

    // Calculus cards
    this.createCardSync({ deckId: calcDeck.id, front: "What is the power rule for derivatives?", back: "d/dx(xⁿ) = nxⁿ⁻¹", difficulty: "Easy", tags: "derivatives, rules" });
    this.createCardSync({ deckId: calcDeck.id, front: "What is the fundamental theorem of calculus?", back: "∫[a to b] f'(x)dx = f(b) - f(a)", difficulty: "Hard", tags: "integration, theorems" });
    this.createCardSync({ deckId: calcDeck.id, front: "What is the derivative of sin(x)?", back: "cos(x)", difficulty: "Medium", tags: "derivatives, trigonometry" });
    this.createCardSync({ deckId: calcDeck.id, front: "What is the chain rule?", back: "d/dx[f(g(x))] = f'(g(x)) × g'(x)", difficulty: "Medium", tags: "derivatives, chain rule" });
    this.createCardSync({ deckId: calcDeck.id, front: "What is the integral of 1/x?", back: "ln|x| + C", difficulty: "Medium", tags: "integration, logarithms" });

    // Statistics cards
    this.createCardSync({ deckId: statsDeck.id, front: "What is the difference between mean and median?", back: "Mean is the average, median is the middle value when data is ordered", difficulty: "Easy", tags: "central tendency, measures" });
    this.createCardSync({ deckId: statsDeck.id, front: "What does standard deviation measure?", back: "The average distance of data points from the mean", difficulty: "Medium", tags: "variability, deviation" });
    this.createCardSync({ deckId: statsDeck.id, front: "What is the central limit theorem?", back: "As sample size increases, the sampling distribution of the mean approaches normal distribution", difficulty: "Hard", tags: "sampling, normal distribution" });
    this.createCardSync({ deckId: statsDeck.id, front: "What is a Type I error?", back: "Rejecting a true null hypothesis (false positive)", difficulty: "Medium", tags: "hypothesis testing, errors" });
    this.createCardSync({ deckId: statsDeck.id, front: "What is the formula for probability?", back: "P(event) = Number of favorable outcomes / Total number of possible outcomes", difficulty: "Easy", tags: "probability, basics" });
  }

  private createDeckSync(insertDeck: InsertDeck): Deck {
    const id = this.currentDeckId++;
    const deck: Deck = {
      ...insertDeck,
      description: insertDeck.description || null,
      category: insertDeck.category || null,
      id,
      createdAt: new Date()
    };
    this.decks.set(id, deck);
    return deck;
  }

  private createCardSync(insertCard: InsertCard): Card {
    const id = this.currentCardId++;
    const card: Card = {
      ...insertCard,
      difficulty: insertCard.difficulty || null,
      tags: insertCard.tags || null,
      id,
      nextReviewDate: new Date(),
      lastReviewed: null,
      timesReviewed: 0,
      correctCount: 0,
      createdAt: new Date()
    };
    this.cards.set(id, card);
    return card;
  }

  async getDecks(): Promise<DeckWithStats[]> {
    const allDecks = Array.from(this.decks.values());
    
    return allDecks.map(deck => {
      const deckCards = Array.from(this.cards.values()).filter(card => card.deckId === deck.id);
      const now = new Date();
      
      const dueCards = deckCards.filter(card => 
        card.nextReviewDate && new Date(card.nextReviewDate) <= now
      ).length;
      
      const newCards = deckCards.filter(card => card.timesReviewed === 0).length;
      const easyCards = deckCards.filter(card => card.difficulty === 'Easy').length;
      const hardCards = deckCards.filter(card => 
        card.difficulty === 'Hard' && card.nextReviewDate && new Date(card.nextReviewDate) <= now
      ).length;
      
      const sessions = Array.from(this.studySessions.values())
        .filter(session => session.deckId === deck.id)
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      const lastStudied = sessions[0]?.createdAt;
      const progress = deckCards.length > 0 ? Math.round((easyCards / deckCards.length) * 100) : 0;

      return {
        ...deck,
        totalCards: deckCards.length,
        dueCards: hardCards > 0 ? hardCards : dueCards,
        newCards,
        masteredCards: easyCards,
        lastStudied: lastStudied ? this.formatTimeAgo(lastStudied) : undefined,
        progress
      };
    });
  }

  async getDeck(id: number): Promise<Deck | undefined> {
    return this.decks.get(id);
  }

  async createDeck(insertDeck: InsertDeck): Promise<Deck> {
    const id = this.currentDeckId++;
    const deck: Deck = {
      ...insertDeck,
      description: insertDeck.description || null,
      category: insertDeck.category || null,
      id,
      createdAt: new Date()
    };
    this.decks.set(id, deck);
    return deck;
  }

  async updateDeck(id: number, updates: Partial<InsertDeck>): Promise<Deck | undefined> {
    const deck = this.decks.get(id);
    if (!deck) return undefined;
    
    const updatedDeck = { ...deck, ...updates };
    this.decks.set(id, updatedDeck);
    return updatedDeck;
  }

  async deleteDeck(id: number): Promise<boolean> {
    // Also delete all cards in the deck
    const deckCards = Array.from(this.cards.values()).filter(card => card.deckId === id);
    deckCards.forEach(card => this.cards.delete(card.id));
    
    return this.decks.delete(id);
  }

  async getCards(deckId: number): Promise<CardWithStatus[]> {
    const deckCards = Array.from(this.cards.values()).filter(card => card.deckId === deckId);
    const now = new Date();
    
    return deckCards.map(card => {
      let status: 'new' | 'due' | 'learning' | 'mastered' = 'new';
      
      if ((card.timesReviewed || 0) === 0) {
        status = 'new';
      } else if ((card.timesReviewed || 0) > 5 && (card.correctCount || 0) / (card.timesReviewed || 1) >= 0.8) {
        status = 'mastered';
      } else if (card.nextReviewDate && new Date(card.nextReviewDate) <= now) {
        status = 'due';
      } else {
        status = 'learning';
      }
      
      const isOverdue = card.nextReviewDate ? new Date(card.nextReviewDate) < now : false;
      
      return {
        ...card,
        status,
        isOverdue
      };
    });
  }

  async getCard(id: number): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async getDueCards(deckId: number): Promise<CardWithStatus[]> {
    const allCards = await this.getCards(deckId);
    const now = new Date();
    
    return allCards.filter(card => 
      card.status === 'new' || 
      (card.nextReviewDate && new Date(card.nextReviewDate) <= now)
    );
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = this.currentCardId++;
    const card: Card = {
      ...insertCard,
      difficulty: insertCard.difficulty || null,
      tags: insertCard.tags || null,
      id,
      nextReviewDate: new Date(),
      lastReviewed: null,
      timesReviewed: 0,
      correctCount: 0,
      createdAt: new Date()
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: number, updates: Partial<Card>): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (!card) return undefined;
    
    const updatedCard = { ...card, ...updates };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCard(id: number): Promise<boolean> {
    return this.cards.delete(id);
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const id = this.currentSessionId++;
    const session: StudySession = {
      ...insertSession,
      cardsStudied: insertSession.cardsStudied || null,
      correctAnswers: insertSession.correctAnswers || null,
      timeSpent: insertSession.timeSpent || null,
      id,
      createdAt: new Date()
    };
    this.studySessions.set(id, session);
    return session;
  }

  async getStudySessions(deckId?: number): Promise<StudySession[]> {
    const sessions = Array.from(this.studySessions.values());
    if (deckId) {
      return sessions.filter(session => session.deckId === deckId);
    }
    return sessions;
  }

  async getStudyStats(): Promise<{
    totalCards: number;
    streak: number;
    accuracy: number;
    timeSpent: number;
    cardsStudiedToday: number;
  }> {
    const allCards = Array.from(this.cards.values());
    const allSessions = Array.from(this.studySessions.values());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = allSessions.filter(session => 
      new Date(session.createdAt || 0) >= today
    );
    
    // Cards today should show cards marked as easy from all decks
    const easyCardsToday = allCards.filter(card => {
      const lastReviewed = card.lastReviewed ? new Date(card.lastReviewed) : null;
      return lastReviewed && 
             lastReviewed >= today && 
             card.difficulty === 'Easy';
    }).length;
    
    const correctToday = todaySessions.reduce((sum, session) => sum + (session.correctAnswers || 0), 0);
    
    // Calculate streak (consecutive days with study activity)
    let streak = 0;
    const sortedSessions = allSessions.sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    
    const uniqueDays = new Set<number>();
    sortedSessions.forEach(session => {
      const day = new Date(session.createdAt || 0);
      day.setHours(0, 0, 0, 0);
      uniqueDays.add(day.getTime());
    });
    
    const sortedDays = Array.from(uniqueDays).sort((a, b) => b - a);
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDays.length; i++) {
      const expectedDay = new Date(currentDay);
      expectedDay.setDate(expectedDay.getDate() - i);
      
      if (sortedDays[i] === expectedDay.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    // Calculate accuracy per deck based on difficulty ratings
    let totalAccuracyScore = 0;
    let totalDecksWithCards = 0;
    
    const deckGroups = new Map<number, Card[]>();
    allCards.forEach(card => {
      if (!deckGroups.has(card.deckId)) {
        deckGroups.set(card.deckId, []);
      }
      deckGroups.get(card.deckId)!.push(card);
    });
    
    Array.from(deckGroups.entries()).forEach(([deckId, deckCards]) => {
      const reviewedCards = deckCards.filter((card: Card) => (card.timesReviewed || 0) > 0);
      if (reviewedCards.length === 0) return;
      
      let deckAccuracyScore = 0;
      reviewedCards.forEach((card: Card) => {
        if (card.difficulty === 'Easy') {
          deckAccuracyScore += 100;
        } else if (card.difficulty === 'Medium') {
          deckAccuracyScore += 50;
        } else if (card.difficulty === 'Hard') {
          deckAccuracyScore += 0;
        }
      });
      
      totalAccuracyScore += deckAccuracyScore / reviewedCards.length;
      totalDecksWithCards++;
    });
    
    const accuracy = totalDecksWithCards > 0 ? Math.round(totalAccuracyScore / totalDecksWithCards) : 0;
    
    const timeSpent = allSessions.reduce((sum, session) => sum + (session.timeSpent || 0), 0);
    
    return {
      totalCards: allCards.length,
      streak,
      accuracy,
      timeSpent,
      cardsStudiedToday: easyCardsToday
    };
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }
}

export const storage = new MemStorage();
