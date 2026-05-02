# AgroDrone Idle

AgroDrone Idle is a browser-based idle/incremental game where the player manages a smart farm from a control station, deploying drones to scan crops, manage irrigation, control pests and optimize production with an AI-powered advisor.

## Screenshots

Screenshots can be added here after running the app locally or deploying the MVP.

## Features

- Futuristic agricultural dashboard UI with resource indicators, operator station, field grid, drone fleet, upgrades and event feed.
- Idle loop that advances crop growth, moisture, pest pressure, passive income, drone battery recovery and automation every second.
- 3x3 wheat field with selectable plots, health, moisture, pest and growth telemetry.
- Drone actions for scanning, watering, pest control and harvesting, with energy, water, money and battery costs.
- Incremental upgrades for new drones, fleet efficiency, batteries, control center and automation modules.
- LocalStorage autosave, automatic load on startup and reset with confirmation.
- Mock AI events and advisor recommendations based on the real game state.
- API-ready AI service prepared for future OpenAI integration through `VITE_OPENAI_API_KEY`.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- LocalStorage
- lucide-react

## Run Locally

```bash
npm install
npm run dev
```

The development server will print a local URL, usually `http://localhost:5173`.

To verify a production build:

```bash
npm run build
```

To run static checks:

```bash
npm run lint
```

## Gameplay Loop

- Plots grow faster when crop health and moisture are high and pest pressure is low.
- Drones consume battery and resources when dispatched, then recover battery while idle or charging.
- The farm earns small passive money from productive field conditions.
- Automation modules add scheduled irrigation, scanning and harvesting once unlocked.
- AI mock events and advisor recommendations react to the current state of the field.

## Architecture Notes

- `src/store/gameStore.ts` owns player-facing state and dispatchable actions.
- Pure simulation, balance and calculation helpers live in `src/utils`.
- `src/utils/gameEngine.ts` contains the idle tick, drone action and automation logic.
- Initial state and upgrade copy live in `src/data`.
- UI components are split by dashboard panel and reusable cards.
- Save/load is isolated in `src/services/saveService.ts` so storage can be swapped later.

## Environment Variables

Copy `.env.example` to `.env` if you want to experiment with future API wiring.

```bash
VITE_OPENAI_API_KEY=
```

The current MVP runs in mock mode by default and does not require an API key.

## AI Mock and API-Ready Structure

AI logic lives in `src/services/aiService.ts`.

- `generateFarmEvent(gameState)` creates mock AI events from real field metrics.
- `generateAdvisorRecommendation(gameState)` returns recommendations based on moisture, pests, energy, crops and agriData.
- `generateOpenAIRecommendation(gameState)` is a protected placeholder for future OpenAI integration.

For production, real OpenAI calls should be moved to a backend so private API keys are never exposed in the browser.

## Save System

Progress is stored in LocalStorage under a versioned payload. The app loads saved progress on startup, autosaves during play and flushes the latest state when the tab is hidden or closed.

## Project Structure

```text
src/
  components/        UI panels and cards
  data/              Initial game state and upgrade metadata
  services/          AI and save services
  store/             Zustand game store and actions
  types/             Strong game domain types
  utils/             Balance, calculations and formatters
```

## Roadmap

- Add crop variety unlocks and plot expansion.
- Add richer event chains and temporary market modifiers.
- Add offline progress calculation.
- Move AI generation to a backend endpoint.
- Add tests for balance calculations and save migration.
- Add deployment config and portfolio screenshots.

## Portfolio Value

This project demonstrates a polished frontend MVP with typed domain modeling, global state, autosave, incremental game logic, modular React components, responsive dashboard UI and a clean abstraction for AI-assisted gameplay.
