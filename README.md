# DocuMind - Simple Complete Project

## Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Backend: http://127.0.0.1:8000
Frontend: http://localhost:5173

Supported files: TXT, PDF, DOCX.

The app has ONE main search interface. The top navigation does not contain another search box.

User-friendly search names:
- Best match = Hybrid search
- Search by meaning = Semantic search
- Exact words = Keyword search

SQLite is used to keep setup simple.
