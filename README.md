# Health Data AI

A full-stack, production-ready system that allows users to query a MongoDB healthcare database using natural language, powered by GPT-4o.

## Demo Video
https://drive.google.com/drive/folders/1FNRL6Mlkuhmp-TIc79P3uQ_tT7Lpl0eJ

## Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB instance (local or Atlas)
- OpenAI API Key

## Setup Guide

### 1. Database Setup
1. Ensure your MongoDB instance is running.
2. Navigate to the backend directory:
   ```bash
   cd e:/ADR/KSN/healthcare-chatbot/backend
   ```
3. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   *Make sure to add your `OPENAI_API_KEY` and set your `MONGO_URI`.*
4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Generate the 10,000 synthetic patient records:
   ```bash
   python scripts/generate_data.py
   ```
   *This will clear existing matching collections and generate new data.*

### 2. Run Backend (FastAPI)
1. Ensure you are in the `backend` directory.
2. Start the server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
3. The API will be available at `http://localhost:8000`. You can test the health endpoint at `http://localhost:8000/health`.

### 3. Run Frontend (Next.js)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd e:/ADR/KSN/healthcare-chatbot/frontend
   ```
2. Install Node dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## Features
- **Natural Language Query**: Type queries like "Show patients from India with Diabetes" and GPT-4o will construct the MongoDB query.
- **Strict Read-Only Enforcement**: The LLM prompt is strictly instructed to generate selection filters only. The backend parses and explicitly blocks any operations outside of a `find()` query. Results are hard-capped at 100 rows per request.
- **Rich UI**: Built with Next.js App Router and Tailwind CSS featuring a modern glassmorphism aesthetic.
- **Detailed Profiles**: Click on any row in the results table to view the full document in a clean Patient Profile Card.
