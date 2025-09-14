from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch, faiss, numpy as np, io, json, os
from transformers import CLIPProcessor, CLIPModel   # ← add this

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

VECTORS_PATH = os.environ.get("VECTORS_PATH", "data/vectors.json")

product_ids, index = [], None
if os.path.exists(VECTORS_PATH):
    with open(VECTORS_PATH, "r") as f:
        vector_data = json.load(f)
    product_ids = vector_data["ids"]
    product_vectors = np.array(vector_data["vectors"]).astype("float32")
    index = faiss.IndexFlatL2(512)
    index.add(product_vectors)

@app.get("/healthz")
def health(): return {"ok": True}

@app.get("/ready")
def ready(): return {"ready": index is not None and len(product_ids) > 0}

@app.post("/api/search")
async def search_image(file: UploadFile = File(...)):
    if index is None: return {"matches": [], "error": "Index not loaded"}
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    inputs = processor(images=image, return_tensors="pt", padding=True)
    with torch.no_grad():
        image_features = model.get_image_features(**inputs)
        image_embedding = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
    image_np = image_embedding.cpu().numpy().astype("float32")
    _, indices = index.search(image_np, k=5)
    matches = [product_ids[i] for i in indices[0]]
    return {"matches": matches}   # ← add this