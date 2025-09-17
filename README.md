# ISSO Scoreboard

A React-based scoreboard application for ISSO tournaments with real-time score updates and team management.

## Features

- **Public Scoreboard**: View live scores and standings for all tournaments
- **Role-based Access**: Viewer, Scorer, and Admin roles with different permissions
- **Multi-sport Support**: Football and Basketball tournaments
- **Real-time Updates**: Live score updates with automatic refresh
- **Team Management**: Request and approve team scorer access
- **Admin Dashboard**: Manage users and approve team requests
- **Mobile Responsive**: Works on all device sizes

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Date Handling**: date-fns

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 2. Clone and Install

```bash
cd JPIS_ISSO_NEW
npm install
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `database-schema.sql` in your Supabase SQL editor
3. Copy your Supabase URL and anon key

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

The application uses the following main tables:

- **sports**: Tournament categories (Football U19, Basketball U17, etc.)
- **teams**: Teams participating in each sport
- **matches**: Individual matches with scores and status
- **football_goals**: Goal events for football matches
- **profiles**: User profiles with roles
- **team_members**: Team access requests and approvals

## User Roles

### Viewer (Default)
- Can view all matches and scores
- Can request team access
- Cannot edit any data

### Scorer
- Can edit scores for approved teams
- Can only edit matches before they're finalized
- Cannot edit final matches

### Admin
- Can edit any match
- Can approve/reject team access requests
- Can change user roles
- Can finalize matches

## Data Import

To import tournament data from Excel files, use the `dataImport.ts` utility:

```typescript
import { importSportData } from './src/utils/dataImport';

// Example for football data
await importSportData('football-u19', teams, matches);
```

## API Endpoints

The application uses Supabase RPC functions for secure operations:

- `set_basketball_score(match_id, home_score, away_score)`
- `add_football_goal(match_id, team_id, player_name, minute, own_goal)`
- `finalize_match(match_id)`
- `user_can_edit_match(match_id)`

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access for matches and scores
- Authenticated users can only edit their own profiles
- Team access requires admin approval
- Match editing restricted by user permissions

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom hooks for data fetching
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── lib/                # External library configurations
└── utils/              # Utility functions
```

### Key Features Implementation

1. **Real-time Updates**: TanStack Query with automatic refetching
2. **Permission System**: Context-based auth with role checking
3. **URL State Management**: Filters sync with URL parameters
4. **Form Validation**: Client-side validation with error handling
5. **Responsive Design**: Mobile-first approach with Tailwind CSS

## Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure environment variables are set in production
4. Configure Supabase CORS settings for your domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.