# search.py

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
import faiss
import numpy as np
import io
import json

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# ✅ Load product vectors from vectors.json
with open("vectors.json", "r") as f:
    vector_data = json.load(f)

product_ids = vector_data["ids"]
product_vectors = np.array(vector_data["vectors"]).astype("float32")

# ✅ Build FAISS index with real vectors
index = faiss.IndexFlatL2(512)
index.add(product_vectors)

@app.post("/api/search")
async def search_image(file: UploadFile = File(...)):
    # Load and process image
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    inputs = processor(images=image, return_tensors="pt", padding=True)

    with torch.no_grad():
        image_features = model.get_image_features(**inputs)
        image_embedding = image_features / image_features.norm(p=2, dim=-1, keepdim=True)

    # Convert to NumPy
    image_np = image_embedding.cpu().numpy().astype("float32")

    # Search top 5 matches
    distances, indices = index.search(image_np, k=5)

    # Return matching product IDs
    matches = [product_ids[i] for i in indices[0]]
    return {"matches": matches}