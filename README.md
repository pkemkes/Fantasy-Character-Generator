# Fantasy Character Generator

A web-based fantasy character builder inspired by D&D, designed as a quick meeting icebreaker. Pick a class, race, and various traits, then optionally generate an AI portrait. Characters are shareable via URL.

## Tech Stack

- **Backend:** Python · FastAPI · SQLite (aiosqlite)
- **Frontend:** React · TypeScript · MUI · Vite
- **AI Images:** OpenAI API (gpt-image-2)
- **Deployment:** Docker · GitHub Actions CI/CD

## Quick Start with Docker

```bash
# Clone the repo
git clone https://github.com/<owner>/fantasy-character-generator.git
cd fantasy-character-generator

# Create a .env file with your OpenAI key (optional — only needed for image generation)
echo "OPENAI_API_KEY=sk-..." > .env

# Build and run
docker compose up --build
```

The app will be available at **http://localhost:8000**.

## Local Development

### Prerequisites

- Python 3.12+
- Node.js 20+
- npm

### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your OpenAI API key for image generation
# Windows PowerShell
$env:OPENAI_API_KEY="sk-..."
# macOS/Linux
export OPENAI_API_KEY="sk-..."

# Start the dev server
uvicorn main:app --reload
```

The API runs at **http://localhost:8000**. Interactive docs are at `/docs`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend runs at **http://localhost:5173** and proxies `/api` requests to the backend at port 8000.

### Building the Frontend

```bash
cd frontend
npm run build
```

The production build outputs to `frontend/dist/`.

## Project Structure

```
├── backend/
│   ├── main.py                  # FastAPI app, CORS, static SPA serving
│   ├── config.py                # Settings via pydantic-settings (env vars)
│   ├── database.py              # SQLite connection & schema init
│   ├── models.py                # Pydantic request/response schemas
│   ├── options.py               # Static option lists
│   ├── routers/
│   │   ├── characters.py        # Character CRUD endpoints
│   │   └── images.py            # Image generation endpoint
│   ├── services/
│   │   ├── character_service.py # Character DB operations
│   │   └── image_service.py     # OpenAI image generation + daily limit
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── main.tsx             # Entry point
│   │   ├── App.tsx              # Router setup
│   │   ├── api.ts               # Backend API client
│   │   ├── theme.ts             # MUI dark theme with fantasy styling
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── components/
│   │   │   ├── CharacterForm.tsx # Creation form with randomize
│   │   │   ├── CharacterCard.tsx # Character display card
│   │   │   ├── OptionField.tsx   # Reusable freeSolo autocomplete
│   │   │   ├── ImageSection.tsx  # Portrait display + generate button
│   │   │   └── ShareButton.tsx   # Copy-link-to-clipboard
│   │   ├── pages/
│   │   │   ├── CreatePage.tsx    # "/" — character creation
│   │   │   └── ViewPage.tsx      # "/character/:id" — shared view
│   │   └── hooks/
│   │       └── useCharacter.ts   # Data fetching hook
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── Dockerfile                   # Multi-stage build (Node + Python)
├── docker-compose.yml
└── .github/workflows/
    └── build-and-push.yml       # CI/CD to ghcr.io
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/options` | All predefined option lists |
| `POST` | `/api/characters` | Create a character |
| `GET` | `/api/characters/{id}` | Get a character by ID |
| `POST` | `/api/characters/{id}/generate-image` | Generate an AI portrait |
| `GET` | `/api/images/{filename}` | Serve a generated image |
| `GET` | `/api/stats` | Remaining image generations today |

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `OPENAI_API_KEY` | _(none)_ | OpenAI API key (required for image generation) |
| `IMAGE_MODEL` | `gpt-image-2` | OpenAI image generation model |
| `DATABASE_PATH` | `./data/characters.db` | SQLite database file path |
| `IMAGE_DIR` | `./data/generated_images` | Directory for generated portraits |
| `DAILY_IMAGE_LIMIT` | `30` | Max AI image generations per day |
| `BASE_URL` | `http://localhost:8000` | Public base URL |
| `LANGCHAIN_API_KEY` | _(none)_ | LangSmith API key (enables tracing) |
| `LANGCHAIN_TRACING_V2` | `false` | Set to `true` to enable LangSmith tracing |
| `LANGCHAIN_PROJECT` | `fantasy-character-generator` | LangSmith project name |
| `LANGCHAIN_ENDPOINT` | `https://api.smith.langchain.com` | LangSmith API endpoint |

## License

MIT
