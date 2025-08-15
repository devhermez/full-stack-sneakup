import requests
import torch
from PIL import Image
from io import BytesIO
import json
import numpy as np
from pymongo import MongoClient
from transformers import CLIPProcessor, CLIPModel

# 1. MongoDB connection (internal Railway URI works inside Railway)
mongo_uri = "mongodb://mongo:lThexyXqLxtXxwcVvtybvfqGrMjZTlhe@mongodb.railway.internal:27017"
client = MongoClient(mongo_uri)
db = client["test"]
collection = db["products"]

# 2. Load CLIP model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# 3. Load product data
products = list(collection.find())

vectors = []
ids = []

for product in products:
    try:
        _id = str(product["_id"])
        image_url = product["images"][0]  # Use first image in array

        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content)).convert("RGB")

        # Process with CLIP
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            features = model.get_image_features(**inputs)
            features = features / features.norm(p=2, dim=-1, keepdim=True)
            embedding = features[0].cpu().numpy().tolist()

        vectors.append(embedding)
        ids.append(_id)
        print(f"✅ Processed: {_id}")

    except Exception as e:
        print(f"❌ Failed to process product {_id}: {e}")

# 4. Save as JSON
with open("vectors.json", "w") as f:
    json.dump({"ids": ids, "vectors": vectors}, f)

print("🎉 Finished generating vectors.")