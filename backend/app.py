# app.py - Flask REST API for the skin disease classification model
from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from flask_cors import CORS
import os
import tempfile
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model
MODEL_PATH = 'skin_disease_detection_model.h5'
model = None
class_labels = None

def load_classification_model():
    global model, class_labels
    try:
        model = load_model(MODEL_PATH)
        print("Model loaded successfully!")
        
        # Load class labels - replace with your actual class labels or load from a file
        # This is a placeholder - you should load your actual class labels here
        class_labels_path = "class_labels.txt"
        if os.path.exists(class_labels_path):
            with open(class_labels_path, 'r') as f:
                class_labels = [line.strip() for line in f.readlines()]
        else:
            # Placeholder classes - replace with your actual classes
            class_labels = ["Acne and Rosacea Photos", 
                            "Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions", 
                            "Atopic Dermatitis Photos", 
                            "Bullous Disease Photos", 
                            "Cellulitis Impetigo and other Bacterial Infections", 
                            "Eczema Photos", 
                            "Exanthems and Drug Eruptions", 
                            "Hair Loss Photos Alopecia and other Hair Diseases", 
                            "Herpes HPV and other STDs Photos", 
                            "Light Diseases and Disorders of Pigmentation",
                            "Lupus and other Connective Tissue diseases",
                            "Melanoma Skin Cancer Nevi and Moles",
                            "Nail Fungus and other Nail Disease",
                            "Poison Ivy Photos and other Contact Dermatitis",
                            "Psoriasis pictures Lichen Planus and related diseases",
                            "Scabies Lyme Disease and other Infestations and Bites",
                            "Seborrheic Keratoses and other Benign Tumors",
                            "Systemic Disease",
                            "Tinea Ringworm Candidiasis and other Fungal Infections",
                            "Urticaria Hives",
                            "Vascular Tumors",
                            "Vasculitis Photos",
                            "Warts Molluscum and other Viral Infections"]
        
        print(f"Loaded {len(class_labels)} class labels: {class_labels}")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint to check if the service is running"""
    if model is not None:
        return jsonify({"status": "ok", "message": "Service is running"}), 200
    else:
        return jsonify({"status": "error", "message": "Model not loaded"}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Endpoint for making predictions from uploaded images"""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    if 'file' not in request.files and 'image' not in request.json:
        return jsonify({"error": "No file or base64 image provided"}), 400
    
    try:
        img = None
        
        # Handle file upload
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No file selected"}), 400

            # Create a temporary file using a context manager
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                file_path = temp_file.name
                file.save(file_path)

            try:
                # Load and preprocess the image
                img = image.load_img(file_path, target_size=(224, 224))
            finally:
                # Ensure file is closed and deleted even if an error occurs
                if os.path.exists(file_path):
                    try:
                        os.unlink(file_path)
                    except Exception as e:
                        print(f"Warning: Could not delete temp file: {e}")
        
        # Handle base64 image
        elif 'image' in request.json:
            try:
                base64_image = request.json['image']
                # Remove the data URL prefix if present
                if ',' in base64_image:
                    base64_image = base64_image.split(',')[1]
                
                # Decode the base64 string
                img_data = base64.b64decode(base64_image)
                img = Image.open(BytesIO(img_data))
                img = img.resize((224, 224))
            except Exception as e:
                return jsonify({"error": f"Invalid base64 image: {str(e)}"}), 400
        
        # Convert image to array and preprocess
        img_array = image.img_to_array(img)
        img_array = img_array / 255.0  # Rescale
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        
        # Make prediction
        predictions = model.predict(img_array)
        
        # Get top 3 predictions
        top_k = 3
        top_indices = predictions[0].argsort()[-top_k:][::-1]
        top_values = predictions[0][top_indices]
        
        # Prepare response
        results = [
            {"class": class_labels[idx], "probability": float(val)}
            for idx, val in zip(top_indices, top_values)
        ]
        
        return jsonify({
            "predictions": results,
            "topPrediction": {
                "class": results[0]["class"],
                "probability": results[0]["probability"]
            }
        }), 200
    
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route('/api/classes', methods=['GET'])
def get_classes():
    """Endpoint to retrieve all class labels"""
    if class_labels is None:
        return jsonify({"error": "Class labels not loaded"}), 500
    
    return jsonify({"classes": class_labels}), 200

if __name__ == "__main__":
    # Load the model before starting the server
    if load_classification_model():
        # Run the Flask server
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        print("Failed to load the model. Exiting.")