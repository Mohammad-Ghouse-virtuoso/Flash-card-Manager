# Flashcard Trainer with Spaced Repetition

## Overview

This is a full-stack flashcard application that uses spaced repetition to help users retain knowledge effectively. The app allows users to create decks, add cards, and train with intelligent spacing algorithms that adapt based on difficulty ratings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state, React hooks for local state
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Development Storage**: In-memory storage fallback for development

## Key Components

### Database Schema
The application uses three main tables:
- **decks**: Stores flashcard deck information (name, description, category)
- **cards**: Individual flashcards with front/back content, difficulty tracking, and spaced repetition metadata
- **study_sessions**: Tracks user study sessions for analytics and progress

### Spaced Repetition System
- **Algorithm**: Simple interval-based system
  - Hard: Review in 1 day
  - Medium: Review in 2 days  
  - Easy: Review in 4 days
- **Card Status**: Tracks review dates, success rates, and repetition counts
- **Progress Tracking**: Session-based analytics with streaks and accuracy metrics

### UI Components
- **Responsive Design**: Mobile-first with bottom navigation for mobile devices
- **Component Library**: Extensive shadcn/ui components for consistent design
- **Interactive Elements**: Flip animations for flashcards, progress indicators, filtering options

## Data Flow

1. **Deck Management**: Users create and organize flashcard decks by category
2. **Card Creation**: Add flashcards with front/back content and optional tags
3. **Training Mode**: Present due cards with flip interactions and difficulty rating
4. **Spaced Repetition**: Algorithm calculates next review dates based on user performance
5. **Progress Tracking**: Sessions are logged with time spent, cards studied, and accuracy rates

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Query)
- Routing and navigation (Wouter)
- Form handling (React Hook Form, Zod validation)

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Backend and Database
- Express.js for server framework
- Drizzle ORM for type-safe database queries
- Neon Database serverless PostgreSQL
- PostgreSQL session store for persistence

### Development Tools
- TypeScript for type safety
- Vite for development and build tooling
- ESBuild for server-side bundling

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle handles schema migrations and deployments

### Environment Configuration
- **Development**: Uses `tsx` for hot reloading TypeScript server
- **Production**: Runs compiled JavaScript with NODE_ENV=production
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Hosting Considerations
- Static frontend can be served by Express in production
- Serverless-ready with PostgreSQL connection pooling
- Environment variables required for database connectivity
- Session storage uses PostgreSQL for persistence across deployments