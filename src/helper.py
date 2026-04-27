from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings


def load_pdf_file(data_path="data/"):
    loader = PyPDFDirectoryLoader(data_path)
    return loader.load()


def text_split(extracted_data):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20,
    )
    return text_splitter.split_documents(extracted_data)


def download_hugging_face_embeddings():
    # Switched to OpenAI embeddings — avoids PyTorch/DLL issues on Windows.
    # text-embedding-3-small produces 1536-dim vectors.
    return OpenAIEmbeddings(model="text-embedding-3-small")
