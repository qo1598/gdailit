# AI Literacy Platform: Mini-Game Technical Specification

This document serves as the hand-off and technical guide for the Mini-Game evolution.

## 🎯 Current Status
- **Base Game**: A "20 Questions" (10-go-gae) style game is implemented in `MiniGame.jsx`.
- **Logic**: Currently uses `Math.random()` for dummy "Yes/No" answers.
- **UI**: Basic chat interface with a winning celebration.

## 🚀 New Requirements (Gemini & Leaderboard)

### 1. AI Host (Gemini Integration)
- **Goal**: Replace random answers with intelligent context-aware responses.
- **API**: Use Google Gemini API (Free tier).
- **Behavior**: Must act as a host, knowing the secret word, and answering only "Yes/No/Unsure" to student questions.
- **Setup Required**: `VITE_GEMINI_API_KEY` must be added to `.env`.

### 2. Daily Word System
- **Goal**: Automatically update the secret word every day.
- **Approach**: 
  - *Option A*: Fixed array in code mapping dates to words.
  - *Option B (Recommended)*: Supabase table `daily_words` with columns `date` and `word`.

### 3. Ranking System (Leaderboard)
- **Goal**: Competitive leaderboard based on the number of turns taken to win.
- **Database**: Needs a `minigame_rankings` table in Supabase.
- **SQL for Setup**:
  ```sql
  -- 1. Rankings Table
  create table minigame_rankings (
    id uuid default uuid_generate_v4() primary key,
    user_id text references profiles(id),
    date date default current_date,
    turns integer not null,
    student_name text,
    completed_at timestamp with time zone default now(),
    unique(user_id, date) 
  );

  -- 2. Daily Words Table (Optional but recommended)
  create table daily_words (
    date date primary key,
    word text not null
  );
  ```

## 🛠 Next Implementation Steps
1. **Gemini SDK**: Install `@google/generative-ai`.
2. **API Logic**: Update `handleQuestionSubmit` in `MiniGame.jsx` to fetch answers from Gemini.
3. **Leaderboard**: Build a slide-up or overlay UI to show the top scores of the day.
4. **Data Persistence**: Ensure `handleGuessSubmit` saves the score to Supabase upon winning.

---
*Last updated: 2026-03-12*
