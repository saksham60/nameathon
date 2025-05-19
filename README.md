# Nameathon 🎉

Monorepo containing:

| Folder | Tech | Purpose |
|--------|------|---------|
| `Backend/` | Python + Flask | REST API → MongoDB Atlas (Render) |
| `Frontend/nameathon-frontend/` | Vite + React + MUI | Cute web UI for submitting baby-name suggestions |

## Live URLs
* API: https://nameathon.onrender.com/api/suggestions
* Front-end: <pending deploy>

## Dev quick-start

### Backend
```bash
cd Backend
python -m venv venv && venv\\Scripts\\activate
pip install -r requirements.txt
set FLASK_ENV=development
python app.py
