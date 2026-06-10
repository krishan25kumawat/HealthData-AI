import os
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

# Load env variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "healthcare_bot")

NUM_PATIENTS = 10000

def generate_random_date(start_year=2024):
    start = datetime(start_year, 1, 1)
    end = datetime.now()
    random_days = random.randint(0, (end - start).days)
    return (start + timedelta(days=random_days)).strftime("%Y-%m-%d")

def generate_data():
    print(f"Connecting to MongoDB at {MONGO_URI}...")
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    # Clear existing
    print("Clearing existing collections...")
    for coll in ["patients", "hospitals", "labs", "pharmacy", "diagnostic", "adt"]:
        db[coll].drop()

    countries = ["India", "USA", "UK", "Australia", "Canada", "Germany", "Brazil"]
    genders = ["Male", "Female", "Other"]
    diagnoses = ["Diabetes", "Hypertension", "Asthma", "COVID-19", "Heart Failure", "Flu", "Migraine", "Fracture"]
    admission_types = ["Emergency", "Outpatient", "Inpatient", "Elective"]
    hospitals = ["Apollo", "Fortis", "Max Healthcare", "AIIMS", "General Hospital", "City Care"]
    tests = ["Blood Sugar", "CBC", "Lipid Profile", "Thyroid", "HbA1c", "Liver Function"]
    medicines = ["Metformin", "Paracetamol", "Aspirin", "Ibuprofen", "Amoxicillin", "Lisinopril"]
    scan_types = ["X-ray", "MRI", "CT Scan", "Ultrasound", "ECG"]
    wards = ["ICU", "General", "Private", "Emergency", "Maternity"]
    results = ["Normal", "Abnormal", "Critical", "Inconclusive"]

    patients = []
    hospital_records = []
    labs = []
    pharmacies = []
    diagnostics = []
    adts = []

    print(f"Generating {NUM_PATIENTS} patient records and related data...")
    for i in range(1, NUM_PATIENTS + 1):
        pid = f"P{i:05d}"
        
        # Patient
        patients.append({
            "patient_id": pid,
            "name": f"Patient Name {i}",
            "age": random.randint(1, 95),
            "gender": random.choice(genders),
            "country": random.choice(countries)
        })
        
        # Hospital (each patient has 1-2 visits)
        for j in range(random.randint(1, 2)):
            hid = f"H{len(hospital_records) + 1:05d}"
            adm_date = generate_random_date()
            dis_date = (datetime.strptime(adm_date, "%Y-%m-%d") + timedelta(days=random.randint(1, 15))).strftime("%Y-%m-%d")
            
            hospital_records.append({
                "hospital_id": hid,
                "patient_id": pid,
                "hospital_name": random.choice(hospitals),
                "admission_date": adm_date,
                "discharge_date": dis_date,
                "diagnosis": random.choice(diagnoses),
                "admission_type": random.choice(admission_types)
            })
            
            # ADT for this visit
            adts.append({
                "adt_id": f"A{len(adts) + 1:05d}",
                "patient_id": pid,
                "admission_type": random.choice(admission_types),
                "ward": random.choice(wards),
                "date": adm_date
            })

        # Labs (1-3 tests)
        for j in range(random.randint(1, 3)):
            labs.append({
                "lab_id": f"L{len(labs) + 1:05d}",
                "patient_id": pid,
                "test_name": random.choice(tests),
                "test_result": random.randint(50, 250),
                "test_date": generate_random_date()
            })

        # Pharmacy (1-2 meds)
        for j in range(random.randint(1, 2)):
            pharmacies.append({
                "pharmacy_id": f"PH{len(pharmacies) + 1:05d}",
                "patient_id": pid,
                "medicine": random.choice(medicines),
                "dosage": f"{random.choice([100, 250, 500])}mg",
                "date": generate_random_date()
            })

        # Diagnostics (0-1 scan)
        if random.random() > 0.5:
            diagnostics.append({
                "diag_id": f"D{len(diagnostics) + 1:05d}",
                "patient_id": pid,
                "scan_type": random.choice(scan_types),
                "result": random.choice(results),
                "date": generate_random_date()
            })

    print("Inserting data...")
    db.patients.insert_many(patients)
    db.hospitals.insert_many(hospital_records)
    db.labs.insert_many(labs)
    db.pharmacy.insert_many(pharmacies)
    if diagnostics:
        db.diagnostic.insert_many(diagnostics)
    db.adt.insert_many(adts)

    print("Creating Indexes...")
    db.patients.create_index("country")
    db.hospitals.create_index("diagnosis")
    db.hospitals.create_index("hospital_name")
    db.patients.create_index("patient_id")
    db.hospitals.create_index("patient_id")

    print("Data generation complete!")
    client.close()

if __name__ == "__main__":
    generate_data()
