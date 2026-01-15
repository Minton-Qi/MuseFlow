# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MuseFlow (墨韵流光)** is a contemplative AI-powered writing companion platform focused on self-discovery and inner growth through mindful writing practice. Users receive curated writing prompts, AI-powered multi-dimensional feedback, and progress tracking.

**Tech Stack:**
- Next.js 16 (App Router) + React 19 + TypeScript 5
- Supabase (PostgreSQL with Row Level Security) for database & auth
- Tailwind CSS 4 with custom dark mode theme
- Zustand for state management
- BigModel GLM-4 API for AI writing feedback
- Framer Motion for animations, Recharts for data visualization

## Development Commands

```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run db:seed          # Seed topics database (uses tsx)
```

**Database Setup:**
1. Run migration files in `/supabase/migrations/` in Supabase SQL Editor (in order: 001 → 002 → 003 → 004)
2. Run `npm run db:seed` to populate topics table

**Required Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anonymous key
BIGMODEL_API_KEY=                   # BigModel GLM-4 API key
BIGMODEL_BASE_URL=                  # Default: https://open.bigmodel.cn/api/paas/v4
NEXT_PUBLIC_APP_URL=                # App URL (http://localhost:3000 for dev)
```

## Architecture

### Supabase Client Pattern

Three separate client configurations for different contexts:
- **`lib/supabase/client.ts`** - Browser components (uses `createBrowserClient`)
- **`lib/supabase/server.ts`** - Server Components & API Routes (uses `createServerClient`)
- **`lib/supabase/middleware.ts`** - Session refresh in middleware

Always use the correct client for the context to avoid hydration issues and auth errors.

### Authentication Flow

1. **AuthProvider** (`components/providers/AuthProvider`) initializes on app mount
2. Calls `refreshSession()` from `authStore` to check auth state
3. **Middleware** (`middleware.ts`) refreshes session on every request
4. API routes verify user before processing (return 401 if not authenticated)
5. RLS policies enforce data access at database level

**Key Pattern:** When adding new protected API routes, always:
- Get user from `supabase/server.ts`
- Return 401 if user is null
- RLS policies will handle database-level authorization

### State Management (Zustand)

Three main stores in `lib/store/`:

**1. authStore** - Authentication state
- `user`, `loading`, `signIn()`, `signUp()`, `signOut()`, `refreshSession()`

**2. writingStore** - Writing session state with auto-save
- `currentSession`, `isSaving`, `lastSavedAt`, `saveError`
- `startSession()`, `updateContent()`, `completeSession()`, `autoSave()`, `saveSession()`
- **Auto-save pattern:** Debounced (30-second minimum), checks content length, upserts to database

**3. themeStore** - Theme state
- `theme`, `setTheme()`, `toggleTheme()`, persists to localStorage

### Database Schema

**Core Tables:**
- **profiles** - Extends Supabase Auth users (auto-created via trigger)
- **topics** - Writing prompts (public read access)
- **writing_sessions** - User writing sessions with status (draft/completed/archived)
- **feedback_history** - AI-generated feedback with JSONB scores
- **user_statistics** - Materialized user stats (auto-updated via trigger)

**Triggers:**
- `handle_new_user()` - Creates profile on signup
- `update_user_statistics()` - Updates stats when session status = 'completed'
- `update_updated_at_column()` - Auto-updates timestamp columns

**Row Level Security (RLS):**
- All user data protected by RLS policies
- Users can only access their own sessions/feedback/statistics
- Topics are publicly readable
- Feedback policies check ownership via writing_sessions relationship

See `supabase/migrations/003_rls_policies.sql` for complete policy definitions.

### Writing Session Lifecycle

1. User selects topic → `startSession(topic)` called in writingStore
2. User types → `updateContent(content)` updates store
3. Auto-save triggered every 30 seconds → `autoSave()` → `saveSession()`
4. User submits → `completeSession()` → status changes to 'completed'
5. Feedback page fetches AI analysis from `/api/ai/feedback`
6. Session completion triggers `update_user_statistics()` in database

**Critical:** When session is marked 'completed', the database trigger automatically updates user_statistics. Never manually update statistics.

### Auto-Save Implementation

**Client-side** (`lib/store/writingStore.ts`):
- Debounced save (minimum 30 seconds between saves)
- Only saves if content length >= 5 characters
- Sets `isSaving` state for UI feedback
- On first save: POST to `/api/writing/sessions` (creates new)
- On subsequent saves: PUT to `/api/writing/sessions/[id]` (updates existing)

**Server-side** (`app/api/writing/auto-save/route.ts`):
- Upsert logic: checks for existing draft session for same topic
- Returns existing session or creates new one
- Always returns session with ID for client to use

### AI Feedback System

**Flow:**
1. Frontend calls `/api/ai/feedback` with `{ content, topic }`
2. API routes to BigModel GLM-4 API with system prompt defining gentle, encouraging persona
3. Returns structured JSON with:
   - Scores (0-100) across 5 dimensions: creativity, emotion, expression, logic, vocabulary
   - Encouragement message
   - Array of improvement suggestions
   - Sentence improvement example with original/improved/explanation
4. **Fallback mechanism:** If API fails, returns generic encouraging feedback
5. Feedback stored in `feedback_history` table

**Topic Categories:**
- imagination 🌙 - Creative scenarios
- emotion 💫 - Feelings & emotional processing
- reflection 🪞 - Self-examination
- creative ✨ - Writing techniques
- philosophical 🌊 - Deep questions

### API Routes Structure

All API routes in `/app/api/` follow this pattern:
- Get user from `supabase/server.ts`
- Return 401 if not authenticated
- Return { error: string } on failure
- Return data object on success

**Key Endpoints:**
- `/api/auth/*` - Authentication (login, register, logout)
- `/api/writing/sessions` - CRUD operations (GET list, POST create, PUT update)
- `/api/writing/auto-save` - Auto-save with upsert logic
- `/api/ai/feedback` - Generate AI feedback
- `/api/topics?category=&limit=` - Fetch topics with optional filters
- `/api/statistics/user` - Get user stats + recent activity chart data
- `/api/health` - Health check

## Key Patterns & Conventions

### TypeScript Types
All types centralized in `lib/types.ts`. Add new types here before using them.

### Component Organization
- Server Components: Default (no "use client")
- Client Components: Add `"use client"` directive at top
- API Routes: `route.ts` with exported named handlers (GET, POST, PUT, DELETE)

### Styling
- **Dark mode:** Class-based (`.dark` on html element)
- **Colors:** Light mode uses Stone/Amber, Dark mode uses Violet/Indigo (#0f0d1a, #1a1625, #2d2640)
- **Fonts:** Sans (Geist) for UI, Serif (Noto Serif SC) for writing content
- **CSS variables:** Defined in `app/globals.css` for theme customization

### Error Handling
- API routes return consistent error format: `{ error: string }`
- Always include user-friendly Chinese error messages
- Check 401 (unauthorized) and 403 (forbidden) status codes
- Use fallback data when external services fail (topics, AI feedback)

### Database Changes
1. Create new migration: `XXX_description.sql` in `/supabase/migrations/`
2. Run in Supabase SQL Editor
3. Update RLS policies if user data is involved
4. Add/update triggers if automatic behavior needed
5. Consider backward compatibility with existing data

### Adding New Features

**Standard workflow:**
1. Add/update types in `lib/types.ts` if needed
2. Create database migration (if schema changes needed)
3. Add API route in `/app/api/[feature]/route.ts`
4. Create Zustand store in `/lib/store/` if state management needed
5. Create components in `/components/[feature]/`
6. Add page in `/app/[feature]/page.tsx` or integrate into existing pages

**Example: Adding a new statistics chart**
1. Add new column to `user_statistics` table (migration)
2. Update RLS policy to allow reading new column
3. Add endpoint to `/api/statistics/user` or create new endpoint
4. Create chart component in `/components/profile/` using Recharts
5. Import into `/app/profile/page.tsx`

## Important Files to Understand

**Must read first:**
- `lib/types.ts` - Core type definitions
- `supabase/migrations/001_initial_schema.sql` - Database structure
- `supabase/migrations/003_rls_policies.sql` - Security policies

**Core architecture:**
- `middleware.ts` - Auth session refresh
- `lib/supabase/client.ts` & `server.ts` - Supabase client patterns
- `lib/store/authStore.ts` - Authentication state management
- `lib/store/writingStore.ts` - Writing state with auto-save logic

**Key features:**
- `app/page.tsx` - Main topic selection flow
- `app/api/ai/feedback/route.ts` - AI integration with fallback
- `app/api/writing/auto-save/route.ts` - Auto-save upsert logic
- `lib/topics.ts` - Topic data structure and fallback data

**Styling:**
- `app/globals.css` - Custom CSS variables & theme classes
- `tailwind.config.ts` - Tailwind configuration
- `app/layout.tsx` - Font loading & provider setup

## Special Considerations

### Chinese Language Support
- App fully bilingual (English/Chinese)
- Use Noto Serif SC for Chinese writing content
- All user-facing messages in Chinese
- Error messages should be in Chinese

### Writing Streak Calculation
Streak is computed from session history:
- Consecutive days with at least one completed session
- Resets if a day is missed
- Checks today or yesterday for active streak
- Computed on-demand in `/app/api/statistics/user`

### Content Word Count
Uses `content.replace(/\s/g, '').length` - counts Chinese characters correctly (removes all whitespace)

### AI Fallback Behavior
When BigModel API fails, the system:
- Catches errors in `/api/ai/feedback/route.ts`
- Returns generic encouraging feedback with moderate scores
- Logs error for debugging
- Never blocks user from completing session

## Deployment Notes

- **Platform:** Vercel (use `npm run vercel-build` which runs build)
- **Environment:** Set all env variables in deployment platform
- **Database:** Run migrations manually in Supabase SQL Editor
- **Seeding:** Run `npm run db:seed` locally or configure CI/CD
- **Domain:** Update `NEXT_PUBLIC_APP_URL` for production URL

### ⚠️ CRITICAL: Git Repository Setup

**This project has TWO remote repositories:**
- `origin` → Gitee (https://gitee.com/minton-qi/muse-flow.git)
- `github` → GitHub (https://github.com/Minton-Qi/MuseFlow.git)

**Vercel is connected to GitHub, NOT Gitee!**

When deploying changes:
```bash
# Push to GitHub (triggers Vercel deployment)
git push github main

# Push to Gitee (backup, does NOT trigger deployment)
git push origin main

# Push to both (recommended)
git push github main && git push origin main
```

**ALWAYS push to `github` remote after making changes** to trigger Vercel deployment.
If you only push to `origin` (Gitee), Vercel will NOT deploy your changes.

Check remotes: `git remote -v`

## Common Tasks

### Pushing code to trigger Vercel deployment
**IMPORTANT: This project uses TWO remotes (GitHub & Gitee)**

1. Check which remotes exist: `git remote -v`
2. Commit your changes: `git commit -m "your message"`
3. **Push to GitHub to trigger Vercel deployment:**
   ```bash
   git push github main  # This triggers Vercel!
   ```
4. Optional: Also push to Gitee for backup:
   ```bash
   git push origin main  # Backup only, no deployment
   ```

**Common mistake:** Using `git push` without specifying remote will push to `origin` (Gitee), which does NOT trigger Vercel deployment.

### Adding a new writing topic
1. Add to `supabase/migrations/004_seed_topics_v2.sql` (or create new migration)
2. Run migration in Supabase SQL Editor
3. Or use `/scripts/seed-topics.ts` to seed programmatically

### Modifying AI feedback prompts
1. Edit system prompt in `/app/api/ai/feedback/route.ts`
2. Adjust prompt structure to maintain JSON response format
3. Test with various writing samples

### Adding new feedback dimension
1. Update `FeedbackScores` type in `lib/types.ts`
2. Add dimension to AI prompt in `/app/api/ai/feedback/route.ts`
3. Update `user_statistics` table to store average (migration)
4. Update chart components in `/components/profile/` to display new dimension

### Debugging authentication issues
1. Check Supabase Auth dashboard for user session
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
3. Check browser console for auth errors
4. Verify RLS policies in Supabase SQL Editor
5. Test `/api/health` endpoint to confirm database connectivity
