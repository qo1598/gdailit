# AI Literacy Platform

This project is a React + Vite application for an AI Literacy platform.

## Setup Instructions for New Machines

Follow these steps to set up the project on a new computer:

### 1. Prerequisites
- Ensure you have **Git** installed.
- Ensure you have **Node.js** installed. We recommend using `nvm` to manage Node versions.

### 2. Clone the Repository
```bash
git clone https://github.com/qo1598/gdailit.git
cd ai-literacy-platform
```

### 3. Node.js Version
Use the version specified in `.nvmrc`:
```bash
nvm use
```
*If you don't have the version installed, run `nvm install`.*

### 4. Install Dependencies
```bash
npm install
```

### 5. Environment Variables
Create a `.env` file in the root directory and fill in the required values from `.env.example`:
```bash
cp .env.example .env
```
Update `.env` with your actual Supabase and Gemini API keys.

### 6. Run the Project
```bash
npm run dev
```

## Deployment
The project is configured for Vercel. Pushing to the `main` branch will trigger a deployment.
