from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import openai
from database import collection
from config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    query: str

class SearchResponse(BaseModel):
    relevant_emails: List[dict]
    summary: str

@app.post("/search", response_model=SearchResponse)
async def search_emails(search_query: SearchQuery):
    # Search in ChromaDB
    results = collection.query(
        query_texts=[search_query.query],
        n_results=5
    )
    
    # Format results
    relevant_emails = []
    for i in range(len(results['documents'][0])):
        relevant_emails.append({
            'content': results['documents'][0][i],
            'metadata': results['metadatas'][0][i]
        })
    
    # Generate summary using OpenAI
    context = "\n\n".join([email['content'] for email in relevant_emails])
    summary_prompt = f"Summarize the following email content in relation to the query: '{search_query.query}'\n\nContent: {context}"
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes email content."},
            {"role": "user", "content": summary_prompt}
        ]
    )
    
    summary = response.choices[0].message.content
    
    return SearchResponse(relevant_emails=relevant_emails, summary=summary)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)