# Fantasy Character Generator — Implementation Plan

## Overview

A web-based fantasy character builder inspired by D&D, designed as a quick meeting icebreaker. Users create a character by picking a class, race, and various traits, then optionally generate an AI portrait. Characters are shareable via URL.

**Stack:** Python (FastAPI) backend · React + TypeScript + MUI frontend · SQLite database · Single Docker container · GitHub Actions CI/CD

---

## 1. Data Model

### Character

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | URL-shareable slug |
| `name` | `string` | Character name |
| `race` | `string` | Predefined list + custom |
| `class_` | `string` | Predefined list + custom |
| `background` | `string` | Predefined list + custom |
| `appearance` | `string` | Short description / keywords |
| `profession` | `string` | Predefined list + custom |
| `personality_trait` | `string` | Predefined list + custom |
| `quirk` | `string` | Predefined list + custom |
| `catchphrase` | `string` | Free text |
| `image_path` | `string?` | Relative path to generated image |
| `created_at` | `datetime` | Auto-set |

### ImageGenerationLog

| Field | Type | Notes |
|---|---|---|
| `id` | `int` (PK) | Auto-increment |
| `character_id` | `uuid` (FK) | |
| `generated_at` | `datetime` | Used for daily limit counting |

### Predefined Options

Stored as static Python constants (not in DB). Examples:

- **Races:** Human, Elf, Dwarf, Halfling, Orc, Gnome, Tiefling, Dragonborn, Half-Elf, Goblin
- **Classes:** Warrior, Mage, Rogue, Ranger, Cleric, Paladin, Bard, Warlock, Druid, Monk
- **Backgrounds:** Noble, Outlander, Sage, Criminal, Folk Hero, Soldier, Hermit, Merchant, Pirate, Wanderer
- **Professions:** Blacksmith, Innkeeper, Herbalist, Bounty Hunter, Scholar, Street Performer, Cartographer, Alchemist, Diplomat, Treasure Hunter
- **Personality Traits:** Brave, Cunning, Cheerful, Mysterious, Sarcastic, Kind-hearted, Hot-headed, Stoic, Mischievous, Optimistic
- **Quirks:** Talks to animals, Collects odd trinkets, Afraid of chickens, Narrates own actions, Allergic to magic, Always hungry, Sings in battle, Terrible liar, Obsessed with maps, Speaks in riddles

Every dropdown also accepts free-text input (MUI `Autocomplete` with `freeSolo`).

---

## 2. Backend (FastAPI)

### Project Structure

```
backend/
├── main.py              # FastAPI app, lifespan, CORS, static mount
├── config.py            # Settings via pydantic-settings (env vars)
├── database.py          # SQLite connection via aiosqlite, schema init
├── models.py            # Pydantic request/response schemas
├── options.py           # Static option lists
├── routers/
│   ├── characters.py    # CRUD endpoints
│   └── images.py        # Image generation endpoint
├── services/
│   ├── character_service.py
│   └── image_service.py # OpenAI API integration + daily limit
├── requirements.txt
└── generated_images/    # Volume-mountable directory for stored images
```

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/options` | Return all predefined option lists |
| `POST` | `/api/characters` | Create a character, return `{ id, ... }` |
| `GET` | `/api/characters/{id}` | Get character by ID (includes image URL if exists) |
| `POST` | `/api/characters/{id}/generate-image` | Generate AI image (rate-limited) |
| `GET` | `/api/images/{filename}` | Serve stored images (static mount) |
| `GET` | `/api/stats` | Return remaining image generations today |

### Image Generation

- Use the **OpenAI Images API** (`gpt-image-2` model via `openai` Python SDK).
- Build a prompt from the character's attributes: race, class, appearance, background, profession, personality, quirk.
- Prompt template: `"Fantasy portrait of a {race} {class_}, {appearance}. They are a {profession} with a {background} background. Personality: {personality_trait}. Quirk: {quirk}. Detailed fantasy art style, vibrant colors."`
- Save the returned image to `generated_images/{character_id}.png`.
- **Daily limit:** Query `ImageGenerationLog` for rows where `generated_at >= today midnight`. If count >= 30, return `429 Too Many Requests` with a message indicating when the limit resets.

### Configuration (env vars)

| Variable | Default | Description |
|---|---|---|
| `OPENAI_API_KEY` | (required) | OpenAI API key |
| `DATABASE_PATH` | `./data/characters.db` | SQLite file path |
| `IMAGE_DIR` | `./data/generated_images` | Image storage directory |
| `DAILY_IMAGE_LIMIT` | `30` | Max images per day |
| `BASE_URL` | `http://localhost:8000` | Public base URL (for share links) |

---

## 3. Frontend (React + TypeScript + MUI)

### Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Router setup
│   ├── api.ts                   # Axios/fetch wrapper for backend calls
│   ├── theme.ts                 # MUI theme (fantasy-inspired palette)
│   ├── types.ts                 # TypeScript interfaces
│   ├── components/
│   │   ├── CharacterForm.tsx    # Main creation form
│   │   ├── CharacterCard.tsx    # Display card (used in view + share)
│   │   ├── OptionField.tsx      # Reusable Autocomplete freeSolo field
│   │   ├── ImageSection.tsx     # Image display + generate button
│   │   └── ShareButton.tsx      # Copy-link-to-clipboard
│   ├── pages/
│   │   ├── CreatePage.tsx       # "/" — character creation
│   │   └── ViewPage.tsx         # "/character/:id" — shared view
│   └── hooks/
│       └── useCharacter.ts      # Data fetching hook
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Pages & Flow

#### CreatePage (`/`)

1. **Header:** App title + short instruction ("Build your fantasy alter ego in 30 seconds!").
2. **Character Form** — single scrollable form, no multi-step wizard:
   - `Name` — text field (required)
   - `Race` — Autocomplete freeSolo with predefined options
   - `Class` — Autocomplete freeSolo with predefined options
   - `Background` — Autocomplete freeSolo with predefined options
   - `Profession` — Autocomplete freeSolo with predefined options
   - `Personality Trait` — Autocomplete freeSolo with predefined options
   - `Quirk` — Autocomplete freeSolo with predefined options
   - `Appearance` — text field for free description
   - `Catchphrase` — text field (optional, fun flavor)
3. **"Randomize" button** — fills all fields with random options (instant fun).
4. **"Create Character" button** — POST to backend → navigates to `/character/{id}`.

#### ViewPage (`/character/:id`)

1. **Character Card** — styled MUI Card showing all attributes in a fantasy-themed layout.
2. **Image Section:**
   - If image exists: display it.
   - If no image: show "Generate Portrait" button + remaining daily count.
   - Loading spinner while generating.
   - Error/limit messaging.
3. **Share Button** — copies the current URL to clipboard with a snackbar confirmation.
4. **"Create Your Own" button** — links back to `/`.

### UX Details

- **Theme:** Dark mode with gold/amber accents. Fantasy-inspired typography (use a Google Font like "MedievalSharp" for headings, system font for body).
- **Responsive:** Works on mobile (single-column) and desktop.
- **Fast:** No account required. No login. Just fill and go.
- **Randomize prominently placed** so people who just want quick fun can click once and go.

---

## 4. Docker Setup

### Single Container Strategy

Use a multi-stage Dockerfile:

1. **Stage 1 (frontend build):** Node 20 image → `npm ci && npm run build` → produces `dist/`.
2. **Stage 2 (runtime):** Python 3.12-slim image → install backend deps → copy backend code → copy frontend `dist/` into a `static/` folder → FastAPI serves the React SPA as static files + API routes.

FastAPI mounts:
- `/api/*` → API routes
- `/api/images/*` → Generated images (static files)
- `/*` → React SPA (`dist/index.html` as fallback for client-side routing)

### Dockerfile

```dockerfile
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./static
EXPOSE 8000
VOLUME ["/app/data"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml

```yaml
services:
  fantasy-character-generator:
    image: ghcr.io/<owner>/fantasy-character-generator:latest
    # Or build locally:
    # build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DAILY_IMAGE_LIMIT=30
      - BASE_URL=http://localhost:8000
    volumes:
      - character-data:/app/data
    restart: unless-stopped

volumes:
  character-data:
```

---

## 5. GitHub Actions CI/CD

### `.github/workflows/build-and-push.yml`

**Triggers:** Push to `main`, tags `v*`.

**Steps:**

1. Checkout code.
2. Set up Docker Buildx.
3. Log in to GitHub Container Registry (`ghcr.io`).
4. Build and push multi-platform image (`linux/amd64`, `linux/arm64`).
5. Tag as `latest` + git tag if applicable.

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]
    tags: ["v*"]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha

      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          platforms: linux/amd64,linux/arm64
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 6. Implementation Order

| Step | Task | Details |
|---|---|---|
| 1 | **Backend scaffold** | FastAPI app, config, database init, option constants |
| 2 | **Character CRUD** | POST + GET endpoints, Pydantic models, SQLite queries |
| 3 | **Frontend scaffold** | Vite + React + TS + MUI setup, theme, routing |
| 4 | **Character form** | CreatePage with all fields, randomize, submit |
| 5 | **Character view** | ViewPage with CharacterCard, share button |
| 6 | **Image generation** | OpenAI integration, daily limit, image storage |
| 7 | **Image display** | Frontend image section with generate button + status |
| 8 | **Docker** | Dockerfile, static file serving, docker-compose |
| 9 | **GitHub Actions** | CI/CD workflow for build + push |
| 10 | **Polish** | Error handling, loading states, mobile responsiveness, README |

---

## 7. Additional Features Included

- **Randomize button** — one-click character creation for people who don't want to think.
- **Catchphrase field** — fun icebreaker flavor ("I cast fireball on Mondays").
- **Remaining image count** — transparent daily limit display so users aren't surprised.
- **Copy-to-clipboard share** — frictionless sharing in chat apps.
- **Dark fantasy theme** — visually engaging, sets the mood immediately.
- **No auth required** — zero friction; anyone with the link can view.
- **Responsive design** — works on phones for in-meeting use.
- **Pinned dependencies** — always use the latest versions of all packages, with exact version pins in `requirements.txt` and `package.json` to ensure reproducible builds.
