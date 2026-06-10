import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "healthcare_bot")

class Database:
    client: MongoClient = None
    db = None

db_instance = Database()

def connect_to_mongo():
    try:
        # Use connection pooling inherently provided by PyMongo
        db_instance.client = MongoClient(MONGO_URI, maxPoolSize=50, serverSelectionTimeoutMS=5000)
        db_instance.db = db_instance.client[DB_NAME]
        print(f"Connected to MongoDB at {MONGO_URI}")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")

def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("MongoDB connection closed")

def get_db():
    if db_instance.db is None:
        connect_to_mongo()
    return db_instance.db
