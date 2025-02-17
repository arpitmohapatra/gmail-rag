from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
import email
import base64
from typing import List, Dict
from datetime import datetime

embeddings = OpenAIEmbeddings()

def process_email(raw_email: str) -> Dict:
    msg = email.message_from_string(raw_email)
    
    # Extract email content
    content = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                content += part.get_payload(decode=True).decode()
    else:
        content = msg.get_payload(decode=True).decode()
    
    # Create metadata
    metadata = {
        "subject": msg["subject"],
        "from": msg["from"],
        "date": msg["date"],
        "id": msg["message-id"]
    }
    
    return {"content": content, "metadata": metadata}

def chunk_and_embed(content: str) -> List[Dict]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_text(content)
    
    # Generate embeddings
    embeddings_list = embeddings.embed_documents(chunks)
    
    return {"chunks": chunks, "embeddings": embeddings_list}