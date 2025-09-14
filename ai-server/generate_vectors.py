import os, requests, torch, json, io
from PIL import Image
from pymongo import MongoClient
from transformers import CLIPProcessor, CLIPModel
import numpy as np

MONGO_URI = os.environ.get("MONGO_URI")
DB_NAME = os.environ.get("MONGO_DB", "test")
COLLECTION = os.environ.get("MONGO_COLLECTION", "products")
VECTORS_PATH = os.environ.get("VECTORS_PATH", "data/vectors.json")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI env var is required")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION]

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

products = list(collection.find())
vectors, ids = [], []

for product in products:
    try:
        _id = str(product["_id"])
        image_url = product["images"][0]
        image = Image.open(io.BytesIO(requests.get(image_url, timeout=30).content)).convert("RGB")
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            feats = model.get_image_features(**inputs)
            feats = feats / feats.norm(p=2, dim=-1, keepdim=True)
            embedding = feats[0].cpu().numpy().tolist()
        vectors.append(embedding)
        ids.append(_id)
        print(f"✅ Processed: {_id}")
    except Exception as e:
        print(f"❌ Failed to process product {_id}: {e}")

os.makedirs(os.path.dirname(VECTORS_PATH), exist_ok=True)
with open(VECTORS_PATH, "w") as f:
    json.dump({"ids": ids, "vectors": vectors}, f)

print("🎉 Finished generating vectors.")