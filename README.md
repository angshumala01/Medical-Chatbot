# Medical Assistant Chatbot

A conversational chatbot that answers medical queries using Retrieval-Augmented Generation (RAG). It embeds a medical PDF book into Pinecone, retrieves the most relevant passages for each query, and generates accurate answers via GPT-4o.

> **Disclaimer:** This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.

---

## Architecture

```
User Query
  └─► Flask  /get  route
        └─► LangChain Retrieval Chain
              ├─► HuggingFace Embeddings (all-MiniLM-L6-v2) applied to query
              ├─► Pinecone similarity search  →  top-3 relevant chunks
              └─► GPT-4o generates answer from retrieved context
                    └─► Response returned to browser
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Language | Python 3.10 |
| Web Framework | Flask |
| Orchestration | LangChain |
| LLM | GPT-4o (OpenAI) |
| Vector Database | Pinecone (Serverless) |
| Embeddings | HuggingFace `all-MiniLM-L6-v2` (384-dim) |
| Production Server | Gunicorn |

---

## Project Structure

```
.
├── app.py                  # Flask app + RAG chain initialisation
├── store_index.py          # One-time script: PDF → embeddings → Pinecone
├── requirements.txt
├── .env                    # API keys (never commit)
├── .gitignore
├── Procfile                # Heroku deployment
├── Dockerfile              # Docker / Cloud Run / Railway deployment
├── src/
│   ├── __init__.py
│   ├── helper.py           # load_pdf_file, text_split, download_hugging_face_embeddings
│   └── prompt.py           # System prompt template
├── data/                   # Place PDF(s) here before running store_index.py
├── templates/
│   └── index.html          # Chat UI
└── static/
    ├── css/style.css
    └── js/chat.js
```

---

## Prerequisites

- Python 3.10+
- A [Pinecone](https://www.pinecone.io/) account (free Starter tier is sufficient)
- An [OpenAI](https://platform.openai.com/) API key with GPT-4o access

---

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd medical-chatbot
```

### 2. Create and activate a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy `.env` and fill in your real credentials:

```bash
# .env
PINECONE_API_KEY=your-pinecone-api-key
OPENAI_API_KEY=your-openai-api-key
PINECONE_INDEX_NAME=medical-chatbot
```

> The Pinecone index will be created automatically by `store_index.py` with `dimension=384` and `metric=cosine`.

### 5. Add your medical PDF

```bash
# Copy the book into the data/ folder
cp Medical_book.pdf data/
```

### 6. Index the PDF into Pinecone (run once)

```bash
python store_index.py
```

Expected output:
```
Total text chunks: 3412
Embeddings stored successfully in Pinecone.
```

### 7. Start the application

```bash
python app.py
```

Open your browser at **http://localhost:8080**

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PINECONE_API_KEY` | Pinecone API key from your console | `pcsk_...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `PINECONE_INDEX_NAME` | Name of the Pinecone index to create/use | `medical-chatbot` |

---

## Deployment Options

### Option 1 — Heroku

```bash
heroku create your-app-name
heroku config:set PINECONE_API_KEY=... OPENAI_API_KEY=... PINECONE_INDEX_NAME=medical-chatbot
git push heroku main
```

The `Procfile` is already configured. Note: run `store_index.py` locally first — Pinecone is cloud-hosted so the index persists independently of your dyno.

---

### Option 2 — AWS Elastic Beanstalk

```bash
pip install awsebcli
eb init -p python-3.10 medical-chatbot
eb create medical-chatbot-env
eb deploy
```

Set environment variables via the EB Console → Configuration → Software → Environment properties.

---

### Option 3 — Google Cloud Run (Docker)

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/medical-chatbot
gcloud run deploy medical-chatbot \
  --image gcr.io/YOUR_PROJECT_ID/medical-chatbot \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars PINECONE_API_KEY=...,OPENAI_API_KEY=...,PINECONE_INDEX_NAME=medical-chatbot
```

---

### Option 4 — Railway.app

1. Push the repo to GitHub.
2. In the Railway dashboard, click **New Project → Deploy from GitHub**.
3. Add environment variables under **Settings → Variables**.
4. Railway auto-detects the `Dockerfile` and deploys.

---

### Option 5 — Docker + VPS (Self-hosted)

```bash
# Build
docker build -t medical-chatbot .

# Run
docker run -d \
  -p 8080:8080 \
  -e PINECONE_API_KEY=... \
  -e OPENAI_API_KEY=... \
  -e PINECONE_INDEX_NAME=medical-chatbot \
  medical-chatbot
```

---

## Cost Notes

| Service | Free Tier |
|---|---|
| Pinecone | 1 Serverless index, 2 GB storage |
| OpenAI GPT-4o | Pay-per-token (~$0.005/1K input tokens) |
| HuggingFace Embeddings | Free — runs locally |

---

## Extending the Knowledge Base

To add more PDFs, copy them into `data/` and re-run:

```bash
python store_index.py
```

New content is upserted alongside existing vectors.
