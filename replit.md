# Event Landing Page Application

## Overview

This is a modern full-stack web application built for Wayne Wu's birthday countdown on August 11th. The application features a spooky, chaotic party-themed landing page with interactive 3D elements, real-time countdown functionality, and mouse tracking effects. Designed specifically for Wayne who works as a bartender at Genies, the app has an alcohol/party theme with spooky disco vibes. It's a single-page application with React frontend and Express backend, enhanced with Three.js for 3D graphics and interactive effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Animation**: Framer Motion for smooth animations (used in countdown component)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for bundling server code

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Configured for PostgreSQL (using Neon Database serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Current Storage**: In-memory storage implementation (MemStorage class) for development

## Key Components

### Frontend Components
- **UI Library**: Complete shadcn/ui component system with 40+ components
- **Pages**: Home page with Wayne's birthday countdown, 404 Not Found page
- **Countdown Features**: 
  - Main birthday countdown to August 11th, 2025
  - Real-time updates with formatted time display (days, hours, minutes, seconds)
  - Interactive countdown cards with 3D mouse hover effects
- **3D Graphics**: Three.js integration with floating bottle animations (bartender theme)
- **Interactive Effects**: 
  - Mouse tracking that affects 3D camera and bottle positions
  - Mouse trail particles with color transitions
  - 3D card rotations responding to mouse movement
- **Styling**: Dark theme with neon party colors (green, pink, purple) and spooky disco vibes
- **Animation**: Framer Motion for smooth transitions, countdown pulses, and interactive hover states
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Components
- **API Routes**: RESTful API structure (currently minimal, ready for expansion)
- **Storage Interface**: IStorage interface with CRUD operations for users
- **Development Server**: Vite integration for hot module replacement
- **Logging**: Custom request logging middleware

### Shared Components
- **Schema**: User model with Drizzle ORM and Zod validation
- **Types**: Shared TypeScript types between client and server

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack React Query
2. **Server Processing**: Express server handles requests through registered routes
3. **Data Storage**: Current implementation uses in-memory storage, designed to easily switch to PostgreSQL
4. **Response Handling**: JSON responses with proper error handling and logging

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@radix-ui/***: Headless UI components for accessibility
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Database ORM and query builder
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library for smooth transitions and hover effects
- **three**: 3D graphics library for interactive background effects
- **@types/three**: TypeScript definitions for Three.js

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Deployment Strategy

### Development
- **Command**: `npm run dev` - starts development server with hot reload
- **Features**: Vite dev server with React hot reload, Express API server
- **Environment**: NODE_ENV=development

### Production Build
- **Frontend**: `vite build` - creates optimized static assets
- **Backend**: `esbuild` bundles server code for production
- **Output**: Static files in `dist/public`, server bundle in `dist/index.js`

### Production Server
- **Command**: `npm start` - runs production server
- **Environment**: NODE_ENV=production
- **Serving**: Express serves both API routes and static frontend assets

### Database Setup
- **Development**: Uses in-memory storage for quick setup
- **Production**: Configured for PostgreSQL with DATABASE_URL environment variable
- **Migrations**: `npm run db:push` applies schema changes

The application is structured to easily scale from the current simple countdown page to a full event management system with user registration, RSVP functionality, and dynamic content management.