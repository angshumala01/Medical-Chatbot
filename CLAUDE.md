# Medical Chatbot — Project Reference

## Architecture

```
Medical_book.pdf
      │
      ▼ (one-time, store_index.py)
  PDF chunks (500 tokens, overlap 20)
      │
      ▼
  OpenAI text-embedding-3-small (1536-dim)
      │
      ▼
  Pinecone index "medical-chatbot" (5,860 vectors)

──────────────────────────────────────────────
         Runtime (per user query)
──────────────────────────────────────────────

Browser (Vercel)
      │  POST /api/chat  {message}
      ▼
Next.js API route  /api/chat/route.ts
      │  POST /get  msg=...
      ▼
Flask backend (Railway)  app.py
      │
      ├─► Pinecone retriever  (top-3 similar chunks)
      │
      └─► GPT-4o (LangChain LCEL chain)
              │
              ▼
         Answer text → Next.js → Browser
```

## Stack

| Layer | Technology |
|---|---|
| LLM | GPT-4o via `langchain-openai` |
| Embeddings | OpenAI `text-embedding-3-small` (1536-dim) |
| Vector DB | Pinecone serverless (`us-east-1`) |
| Backend | Flask + Gunicorn, LangChain LCEL |
| Frontend | Next.js 14 App Router, TypeScript, Tailwind CSS |
| Backend hosting | Railway |
| Frontend hosting | Vercel |
| Source control | GitHub (`angshumala01/Medical-Chatbot`) |

## Environment Variables

| Variable | Used by |
|---|---|
| `OPENAI_API_KEY` | Flask (embeddings + GPT-4o) |
| `PINECONE_API_KEY` | Flask (vector store) |
| `PINECONE_INDEX_NAME` | Flask (`medical-chatbot`) |
| `FLASK_API_URL` | Vercel (points to Railway URL) |

## Steps Followed

1. Created project scaffold: Flask app, `src/helper.py`, `src/prompt.py`, `store_index.py`, and vanilla HTML chat UI.
2. Configured `src/prompt.py` with a system prompt instructing GPT-4o to answer from retrieved medical context only.
3. Wrote `src/helper.py` with `load_pdf_file`, `text_split`, and `download_hugging_face_embeddings` using HuggingFace `all-MiniLM-L6-v2`.
4. Switched embeddings from HuggingFace to OpenAI `text-embedding-3-small` because `torch` caused a DLL load failure on Windows (WinError 1114).
5. Ran `store_index.py` to chunk `Medical_book.pdf` into 5,860 vectors and upsert them into Pinecone index `medical-chatbot` (1536-dim, cosine, AWS us-east-1).
6. Rewrote `app.py` using LangChain LCEL (`RunnablePassthrough | prompt | llm | StrOutputParser`) after `create_retrieval_chain` was removed in LangChain 1.0.
7. Verified RAG correctness locally: retrieved chunks showed `source: data\Medical_book.pdf` and GPT-4o answers mirrored verbatim text from the book.
8. Built a Next.js 14 frontend in `frontend/` with TypeScript, Tailwind CSS, a chat UI, and suggestion chips.
9. Added a Next.js API route (`/api/chat/route.ts`) to proxy browser requests to Flask's `/get` endpoint, keeping the OpenAI key server-side.
10. Wrapped all Pinecone/LLM initialisation in a lazy `get_rag_chain()` function so Flask starts instantly and passes Railway's health check.
11. Deployed the Flask backend to Railway via `railway up --detach` with `Procfile` (`gunicorn app:app`).
12. Set `OPENAI_API_KEY`, `PINECONE_API_KEY`, and `PINECONE_INDEX_NAME` as Railway environment variables via `railway variables set`.
13. Deployed the Next.js frontend to Vercel via `vercel --prod` and set `FLASK_API_URL` pointing to the Railway URL.
14. Confirmed end-to-end production chain: Vercel → Railway → Pinecone → GPT-4o returns medical answers.
15. Pushed all code to GitHub (`angshumala01/Medical-Chatbot`), with `.env` excluded via `.gitignore` so API keys never entered version control.

## Key URLs

- **Frontend:** https://frontend-three-wheat-28.vercel.app
- **Backend:** https://medical-chatbot-backend-production-07c8.up.railway.app
- **GitHub:** https://github.com/angshumala01/Medical-Chatbot
