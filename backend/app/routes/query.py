from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.query_service import generate_and_execute_query

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

@router.post("/query", tags=["Query"])
async def run_query(request: QueryRequest):
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
    result = await generate_and_execute_query(request.question)
    
    if "error" in result:
        # We can return a 400 for LLM parse errors or validation errors
        raise HTTPException(status_code=400, detail=result)
        
    return result
