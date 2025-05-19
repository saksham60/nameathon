import os
from datetime import datetime
from urllib.parse import quote_plus
from werkzeug.exceptions import BadRequest

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# ----- MongoDB connection ---------------------------------

username = quote_plus(os.getenv("MONGO_USER"))  
password = quote_plus(os.getenv("MONGO_PASS"))  

mongo_uri = (
    f"mongodb+srv://{username}:{password}@{os.getenv('MONGO_CLUSTER')}/"
    f"{os.getenv('MONGO_DBNAME')}?retryWrites=true&w=majority&appName=Namethon"
)

client = MongoClient(mongo_uri)

db = client[os.getenv("DB_NAME", "namethon")]
col = db[os.getenv("COLLECTION", "suggestions")]

# ----- Flask app ------------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # loosen CORS for dev

# Helpers --------------------------------------------------
def serialize(doc):
    """Convert Mongo doc → JSON-safe dict."""
    doc["id"] = str(doc.pop("_id"))
    return doc


# Routes ---------------------------------------------------
@app.get("/api/suggestions")
def get_suggestions():
    docs = col.find().sort("createdAt", -1)  # newest first
    return jsonify([serialize(d) for d in docs]), 200

@app.post("/api/suggestions")
def add_suggestion():
    # Always try to parse JSON; return clear message on failure
    try:
        data = request.get_json(force=True)          # forces JSON parse
        if data is None:                              # empty body
            raise BadRequest("Empty JSON payload")
    except BadRequest as err:
        return jsonify({"message": str(err)}), 400

    name = (data.get("name") or "").strip()    
    # Validate name exists and starts with T or R
    if not name:
        return jsonify({"message": "Name is required"}), 400
    if name[0].upper() not in {"T", "R"}:
        return jsonify({"message": "Name must start with T or R."}), 400

    doc = {
        "giverName": (data.get("giverName") or "Anonymous").strip() or "Anonymous",
        "relation": (data.get("relation") or "Friend").strip() or "Friend",
        "name": name,
        "createdAt": datetime.utcnow(),
    }
    
    try:
        inserted_id = col.insert_one(doc).inserted_id
        doc["_id"] = inserted_id
        return jsonify(serialize(doc)), 201
    except Exception as e:
        print("Database error:", str(e))
        return jsonify({"message": "Server error"}), 500

if __name__ == "__main__":
    # For local dev: python app.py
    port = int(os.getenv("PORT", 4000))
    app.run(host="0.0.0.0", port=port, debug=True)
