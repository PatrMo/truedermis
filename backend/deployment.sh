#!/bin/bash

# Set AWS credentials and region
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1

# Create EB application and environment
eb init -p python-3.9 truedermis-app
eb create truedermis-env \
  --instance-type t3.medium \
  --envvars MODEL_PATH=/var/app/current/skin_disease_detection_model.h5

# Upload model to S3 for backup and potential future use
aws s3 cp skin_disease_detection_model.h5 s3://truedermis-models/