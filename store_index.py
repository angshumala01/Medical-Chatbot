"""
Run this script once to load PDFs, generate embeddings, and populate Pinecone.

Usage:
    1. Copy your PDF(s) into the data/ folder.
    2. Fill in .env with your API keys.
    3. python store_index.py
"""

import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

from src.helper import load_pdf_file, text_split, download_hugging_face_embeddings

load_dotenv()

PINECONE_API_KEY = os.environ["PINECONE_API_KEY"]
PINECONE_INDEX_NAME = os.environ["PINECONE_INDEX_NAME"]

# Load and split PDFs
extracted_data = load_pdf_file(data_path="data/")
text_chunks = text_split(extracted_data)
print(f"Total text chunks: {len(text_chunks)}")

# Embeddings — OpenAI text-embedding-3-small produces 1536-dim vectors
embeddings = download_hugging_face_embeddings()

# Pinecone v3 API
pc = Pinecone(api_key=PINECONE_API_KEY)

# Create index if it does not already exist
if PINECONE_INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=1536,     # must match text-embedding-3-small output
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )
    print(f"Created Pinecone index: {PINECONE_INDEX_NAME}")
else:
    print(f"Index '{PINECONE_INDEX_NAME}' already exists — upserting into it.")

# Upsert embeddings
PineconeVectorStore.from_documents(
    documents=text_chunks,
    embedding=embeddings,
    index_name=PINECONE_INDEX_NAME,
)
print("Embeddings stored successfully in Pinecone.")
