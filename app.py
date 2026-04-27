import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Lazy-loaded — initialised on first request, not at startup.
# This lets Railway pass its health check immediately.
_rag_chain = None


def get_rag_chain():
    global _rag_chain
    if _rag_chain is not None:
        return _rag_chain

    from pinecone import Pinecone
    from langchain_pinecone import PineconeVectorStore
    from langchain_openai import ChatOpenAI
    from langchain_core.runnables import RunnablePassthrough
    from langchain_core.output_parsers import StrOutputParser
    from src.helper import download_hugging_face_embeddings
    from src.prompt import prompt

    embeddings = download_hugging_face_embeddings()

    docsearch = PineconeVectorStore.from_existing_index(
        index_name=os.environ["PINECONE_INDEX_NAME"],
        embedding=embeddings,
    )

    retriever = docsearch.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3},
    )

    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0.4,
        openai_api_key=os.environ["OPENAI_API_KEY"],
    )

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    _rag_chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return _rag_chain


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/get", methods=["POST"])
def chat():
    msg = request.form.get("msg", "").strip()
    if not msg:
        return "Please enter a message.", 400
    answer = get_rag_chain().invoke(msg)
    return answer


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)), debug=True)
