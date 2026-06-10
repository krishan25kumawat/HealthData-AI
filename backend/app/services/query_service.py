import json
import os
from dotenv import load_dotenv
from openai import OpenAI
from app.llm.prompt import LLM_SYSTEM_PROMPT
from app.db.database import get_db

load_dotenv()

# Using Groq's OpenAI-compatible API for free, fast inference
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY", "dummy"),
    base_url="https://api.groq.com/openai/v1"
)

VALID_COLLECTIONS = ["patients", "hospitals", "labs", "pharmacy", "diagnostic", "adt"]

def parse_llm_response(text: str) -> dict:
    try:
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        
        parsed = json.loads(text.strip())
        return parsed
    except Exception as e:
        raise ValueError(f"Failed to parse LLM response to JSON: {e}")

def validate_query(query_json: dict) -> dict:
    collection = query_json.get("collection")
    if not collection or collection not in VALID_COLLECTIONS:
        raise ValueError(f"Invalid collection '{collection}'. Must be one of {VALID_COLLECTIONS}")
    
    pipeline = query_json.get("pipeline")
    if pipeline is None or not isinstance(pipeline, list):
        raise ValueError("Query must contain a 'pipeline' array.")

    pipeline_str = json.dumps(pipeline)
    if "$where" in pipeline_str or "$expr" in pipeline_str:
        raise ValueError("Query contains blocked operators ($where or $expr).")
        
    blocked_stages = ["$out", "$merge", "$setWindowFields", "$delete"]
    for stage in pipeline:
        for key in stage.keys():
            if key in blocked_stages:
                raise ValueError(f"Blocked aggregation stage: {key}")
                
    pipeline.append({"$limit": 100})
    return query_json

async def generate_and_execute_query(user_question: str) -> dict:
    db = get_db()
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile", # Groq's active Llama 3.3 model
            messages=[
                {"role": "system", "content": LLM_SYSTEM_PROMPT},
                {"role": "user", "content": user_question}
            ],
            temperature=0.0
        )
        llm_output = response.choices[0].message.content
    except Exception as e:
        return {"error": f"LLM API Error: {str(e)}"}

    
    # 2. Parse and Validate
    try:
        query_json = parse_llm_response(llm_output)
        validated_query = validate_query(query_json)
    except Exception as e:
        return {"error": str(e), "raw_llm_output": llm_output}

    # 3. Execute
    collection_name = validated_query["collection"]
    pipeline = validated_query["pipeline"]
    
    try:
        coll = db[collection_name]
        cursor = coll.aggregate(pipeline)
        
        # Convert _id to string for JSON serialization, handling nested objects from $lookup
        def convert_objectids(data):
            from bson import ObjectId
            if isinstance(data, dict):
                return {k: convert_objectids(v) for k, v in data.items()}
            elif isinstance(data, list):
                return [convert_objectids(i) for i in data]
            elif isinstance(data, ObjectId):
                return str(data)
            return data

        results = [convert_objectids(doc) for doc in cursor]
            
        return {
            "query_used": validated_query,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
         return {"error": f"Database execution error: {e}", "query_used": validated_query}
