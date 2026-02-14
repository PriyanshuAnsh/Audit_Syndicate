# InvestiPet MVP

Monorepo containing:
- `apps/api`: FastAPI + SQLite backend
- `apps/web`: Next.js + Tailwind frontend
- `infra/docker-compose.yml`: local stack runner

## Quickstart

1. Start backend:
```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

2. Start frontend:
```bash
cd apps/web
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

3. Open `http://localhost:3000`

## Implemented endpoints
- Auth: register/login/refresh
- User/Pet: me, pet, family, equip
- Market: assets, quotes
- Trading: buy, sell, portfolio
- Learning: lessons list/detail/submit
- Economy: rewards balance/history, shop items, purchase, inventory
