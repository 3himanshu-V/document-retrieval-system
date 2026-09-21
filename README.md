# DocuMind - AI-Powered Document Retrieval System

DocuMind is a full-stack document retrieval system that allows users to upload, search, view, and manage documents through a simple web interface.

The system supports keyword-based, semantic, and hybrid retrieval internally, while providing the user with a single **Best Match** search interface.

## Features

- Upload TXT, PDF, and DOCX documents
- Search documents using natural-language queries
- Hybrid search combining keyword and semantic similarity
- Relevance-based search results
- Document preview and viewing
- Search history
- Document management and deletion
- Dashboard with document and search statistics
- SQLite database for simple local setup
- React-based frontend
- FastAPI backend

## Project Structure

```text
DocuMind/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── index.css
│       └── main.jsx
│
├── .gitignore
└── README.md