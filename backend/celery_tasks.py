from celery import Celery
from celery.schedules import crontab
from gmail import fetch_new_emails
from email_processor import process_email, chunk_and_embed
from database import collection

celery_app = Celery('tasks', broker='redis://localhost:6379/0')

@celery_app.task
def process_new_emails():
    new_emails = fetch_new_emails()
    
    for email_data in new_emails:
        processed = process_email(email_data)
        chunks_and_embeddings = chunk_and_embed(processed["content"])
        
        # Store in ChromaDB
        collection.add(
            embeddings=chunks_and_embeddings["embeddings"],
            documents=chunks_and_embeddings["chunks"],
            metadatas=[processed["metadata"]] * len(chunks_and_embeddings["chunks"]),
            ids=[f"{processed['metadata']['id']}_{i}" for i in range(len(chunks_and_embeddings["chunks"]))]
        )

# Schedule email fetching every 5 minutes
celery_app.conf.beat_schedule = {
    'fetch-emails': {
        'task': 'celery_tasks.process_new_emails',
        'schedule': crontab(minute='*/5'),
    },
}