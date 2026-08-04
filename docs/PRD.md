# NACL Community Platform - PRD

## Overview
A premium full-stack web application for NACL, a modern community-driven event and culture platform. The app offers curated experiences for movement, creativity, wellness, and connection with a design aesthetic that feels like a blend of Spiral by Soot, Cloka, and Apple Vision Pro.

## Tech Stack
- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js + React Three Fiber
- GSAP
- Node.js
- MongoDB
- NextAuth Google OAuth

## Folder Structure
```
/src
  /app
    /admin         # Admin dashboard
    /api           # API routes
    /events        # Events grid and details pages
    globals.css    # Global styling & Tailwind theme
    layout.tsx     # Root layout
    page.tsx       # 3D Hero Landing Page
  /components
    /layout        # Reusable layout wrappers (Header, Footer)
    /ui            # UI components (Buttons, Inputs, Cards)
    /minigame      # Minigame component system
    /3d            # React Three Fiber components
  /lib
    db.ts          # MongoDB connection utility
  /models          # Mongoose schemas
```

## Database Schema (MongoDB)
- **Users**: _id, name, email, image, role, badges, createdAt
- **Events**: _id, title, description, category, location, date, host (ref User), maxSeats, remainingSeats, image
- **Registrations**: _id, event (ref Event), user (ref User), status (joined, waitlist), qrCode
- **Badges**: _id, name, type (Explorer, Creator, etc.), icon
- **MiniGames**: _id, eventId (ref Event), type
- **Communities**: _id, name, members (ref Users)

## API Routes
- `GET /api/events` - Fetch events (w/ filters/pagination)
- `GET /api/events/[id]` - Fetch event details
- `POST /api/events` - Admin: Create new event
- `POST /api/events/[id]/register` - Register for an event
- `POST /api/minigame/submit` - Submit answers and generate community archetype badge
- `GET /api/user/profile` - Get user profile and badges

## UI Component Architecture
- **Navbar**: Sticky navigation, smooth transitions, authentication trigger.
- **Hero3D**: R3F canvas for the 3D particle universe.
- **EventCard**: Animated card with 3D tilt effects containing event info.
- **EventGrid**: Masonry style layout for the discover page.
- **MinigameModal**: Modal overlay for the Community Match flow.
- **Footer**: Minimal animated footer.

## Sprints & Prioritization
### Sprint 1 (This Week)
- 3D Hero Landing Page
- Events Grid
- Event Details Page
- Community Match Mini-Game
- MongoDB Schema Configuration
