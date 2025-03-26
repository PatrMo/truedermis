import os
import boto3
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import tempfile
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

# Configurable model path with fallback
MODEL_PATH = os.environ.get('MODEL_PATH', 'skin_disease_detection_model.h5')
model = None
class_labels = None

def download_model_from_s3():
    """Optionally download model from S3 if not present locally"""
    if not os.path.exists(MODEL_PATH):
        try:
            s3 = boto3.client('s3')
            bucket_name = 'truedermis-models'
            s3.download_file(bucket_name, 'skin_disease_detection_model.h5', MODEL_PATH)
            print("Model downloaded from S3")
            return True
        except Exception as e:
            print(f"S3 download failed: {e}")
            return False
    return True

def load_classification_model():
    global model, class_labels
    try:
        # Attempt to download from S3 if local model doesn't exist
        if not os.path.exists(MODEL_PATH):
            if not download_model_from_s3():
                return False

        # Load model with memory-efficient method
        model = tf.keras.models.load_model(
            MODEL_PATH, 
            custom_objects=None, 
            compile=False
        )
        
        # Load class labels
        class_labels_path = "class_labels.txt"
        if os.path.exists(class_labels_path):
            with open(class_labels_path, 'r') as f:
                class_labels = [line.strip() for line in f.readlines()]
        else:
            # Existing placeholder classes
            class_labels = [
                "Acne and Rosacea Photos", 
                # ... (previous class labels)
            ]
        
        print(f"Loaded {len(class_labels)} class labels")
        return True
    except Exception as e:
        print(f"Model loading error: {e}")
        return False

# Existing route handlers remain the same as in original app.py

if __name__ == "__main__":
    # Optimization: Pre-load model
    if load_classification_model():
        # Use Gunicorn for production
        from gunicorn.app.base import BaseApplication

        class FlaskApplication(BaseApplication):
            def __init__(self, app, options=None):
                self.options = options or {}
                self.application = app
                super().__init__()

            def load_config(self):
                for key, value in self.options.items():
                    self.cfg.set(key.lower(), value)

            def load(self):
                return self.application

        options = {
            'bind': '0.0.0.0:5000',
            'workers': 4,
            'worker_class': 'gthread',
            'threads': 4,
        }

        FlaskApplication(app, options).run()
    else:
        print("Failed to load model. Exiting.")