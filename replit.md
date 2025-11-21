# Derby Prediction Game

## Overview

A mobile-first sports prediction web application built for Turkish users to predict derby match outcomes. Users answer 12 questions about match events (score, goals, cards, VAR decisions, etc.), submit their predictions with a Player ID, and compete on a leaderboard based on prediction accuracy.

The application features a multi-screen flow: welcome screen → prediction form → leaderboard, with progress tracking, local draft persistence, and real-time leaderboard updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for development and production builds.

**UI Component System**: shadcn/ui components built on Radix UI primitives, providing accessible, customizable components (dialogs, forms, cards, buttons, etc.) styled with Tailwind CSS using the "new-york" preset.

**Styling Approach**: Utility-first CSS via Tailwind with custom HSL-based color system supporting light/dark themes. Design follows mobile-first responsive principles with specific typography hierarchy (Inter font family) and spacing units (Tailwind's 3, 4, 6, 8, 12, 16 scale).

**State Management**: 
- React Hook Form with Zod validation for form state and validation
- TanStack Query (React Query) for server state, caching, and data fetching
- Local theme state via Context API (ThemeProvider)
- LocalStorage for draft prediction persistence and theme preference

**Routing**: Wouter for lightweight client-side routing, handling welcome/form/leaderboard views within a single-page application.

**Key Design Patterns**:
- Component composition with shadcn/ui's slot-based components
- Form validation through schema-driven approach (Zod schemas shared between client/server)
- Progressive enhancement with auto-save functionality for user predictions
- Mobile-optimized touch targets (min-h-12) and scan-friendly layouts

### Backend Architecture

**Runtime**: Node.js with Express.js server handling API routes and static file serving.

**API Design**: RESTful endpoints under `/api/*` prefix:
- `POST /api/predictions` - Submit predictions with validation
- `GET /api/leaderboard` - Retrieve ranked player scores
- Player ID validation integrated into submission flow

**Development vs Production**: 
- Development: Vite dev server with HMR via middleware mode
- Production: Pre-built static assets served from `dist/public`

**Request Processing**: 
- JSON body parsing with raw body capture for webhook/signature verification
- Request/response logging with duration tracking for API routes
- Error handling with appropriate HTTP status codes and Turkish error messages

**Validation Layer**: Shared Zod schemas (`@shared/schema.ts`) ensure consistent validation between client and server, reducing duplicate validation logic.

### Data Storage Solution

**Database**: Firebase Firestore (NoSQL document database) chosen for:
- Real-time capabilities for leaderboard updates
- Flexible schema for prediction data
- Scalability without complex setup
- Built-in authentication integration potential

**Data Models**:
- **Predictions Collection**: Stores user predictions with fields matching schema (userName, playerId, 12 question answers, timestamps)
- **Leaderboard**: Calculated from predictions with scoring logic, ranked by accuracy

**Firebase Integration**: Server-side Firebase Admin SDK initialized with service account credentials from environment variables (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY).

**Storage Interface**: Abstract `IStorage` interface allows for potential database switching without changing business logic. Current implementation: `FirestoreStorage`.

**Data Flow**: 
1. Client submits prediction → Server validates schema
2. Player ID validation check
3. Prediction saved to Firestore with generated UUID
4. Score calculated and leaderboard updated
5. Success response returned to client

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives (accordion, dialog, dropdown, radio-group, progress, tabs, etc.)
- Tailwind CSS for styling
- class-variance-authority and clsx for conditional class management
- Lucide React for icons

**Form & Validation**:
- react-hook-form - Form state management
- @hookform/resolvers - Zod integration
- zod - Schema validation
- drizzle-zod - Database schema to Zod conversion

**Database & ORM**:
- Firebase Admin SDK - Firestore database operations
- Drizzle ORM - Type-safe database toolkit (configured for PostgreSQL as fallback/alternative)
- @neondatabase/serverless - Neon serverless Postgres driver

**Date & Time**:
- date-fns - Date manipulation and formatting with Turkish locale support

**Development Tools**:
- Vite - Build tool and dev server
- TypeScript - Type safety
- @replit/* plugins - Replit-specific development enhancements (error overlay, cartographer, dev banner)

**Session Management**:
- express-session with connect-pg-simple for PostgreSQL session storage (if/when implemented)

**API & State Management**:
- TanStack Query - Server state and caching with 30-second auto-refresh for leaderboard
- Wouter - Lightweight routing (~1.2KB)

**Carousel/Embla**: embla-carousel-react for potential future carousel features

**Environment Configuration**: All sensitive credentials loaded via environment variables with validation on server startup.