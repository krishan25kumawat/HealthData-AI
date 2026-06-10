from fastapi import APIRouter

router = APIRouter()

# Statically define the schema since MongoDB is schemaless
SCHEMA = {
    "patients": {
        "patient_id": "string",
        "name": "string",
        "age": "int",
        "gender": "string",
        "country": "string"
    },
    "hospitals": {
        "hospital_id": "string",
        "patient_id": "string",
        "hospital_name": "string",
        "admission_date": "string (YYYY-MM-DD)",
        "discharge_date": "string (YYYY-MM-DD)",
        "diagnosis": "string",
        "admission_type": "string"
    },
    "labs": {
        "lab_id": "string",
        "patient_id": "string",
        "test_name": "string",
        "test_result": "int",
        "test_date": "string (YYYY-MM-DD)"
    },
    "pharmacy": {
        "pharmacy_id": "string",
        "patient_id": "string",
        "medicine": "string",
        "dosage": "string",
        "date": "string (YYYY-MM-DD)"
    },
    "diagnostic": {
        "diag_id": "string",
        "patient_id": "string",
        "scan_type": "string",
        "result": "string",
        "date": "string (YYYY-MM-DD)"
    },
    "adt": {
        "adt_id": "string",
        "patient_id": "string",
        "admission_type": "string",
        "ward": "string",
        "date": "string (YYYY-MM-DD)"
    }
}

@router.get("/schema", tags=["Schema"])
async def get_schema():
    return SCHEMA
