# Event Landing Page Application

## Overview

This is a modern full-stack web application built for "The August BDAY-Verse" party event. The application features a spooky-themed landing page with dual countdown functionality: a main countdown to the party date (August 2nd, 7pm) and individual birthday countdowns for three August Leo birthday celebrants. It's designed as a single-page application with a React frontend and an Express backend, featuring a clean architecture that separates client, server, and shared components.

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
- **Pages**: Home page with dual countdown functionality, 404 Not Found page
- **Countdown Features**: 
  - Main party countdown to August 2nd, 7pm-2am
  - Individual birthday countdowns for Nara Lee (Aug 1), Isabella Rovira (Aug 3), Wayne Wu (Aug 11)
  - Real-time updates with formatted time display
- **Styling**: Dark theme with custom spooky party colors (neon green, neon pink, shadow purple)
- **Animation**: Framer Motion for countdown animations, floating particles, and hover effects
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
- **framer-motion**: Animation library

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