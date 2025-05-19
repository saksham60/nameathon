from pymongo import MongoClient
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

load_dotenv()

username = quote_plus(os.getenv("MONGO_USER"))
password = quote_plus(os.getenv("MONGO_PASS")) 

mongo_uri = f"mongodb+srv://{username}:{password}@namethon.5a19vh6.mongodb.net/?retryWrites=true&w=majority&appName=Namethon"

try:
    client = MongoClient(mongo_uri)
    print("Connection successful! Databases:", client.list_database_names())
except Exception as e:
    print("CONNECTION FAILED:", str(e))