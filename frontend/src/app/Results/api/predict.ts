// pages/api/predict.ts - API route to proxy requests to the Flask backend
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import formidable, { File } from 'formidable';
import { createReadStream } from 'fs';
import FormData from 'form-data';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = new formidable.IncomingForm();

    const [, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Ensure file is correctly typed
    let file: File | undefined;
    if (files.file) {
      file = Array.isArray(files.file) ? files.file[0] : files.file;
    }

    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'No file uploaded or invalid file data' });
    }

    // Create form data for the API request
    const formData = new FormData();
    formData.append('file', createReadStream(file.filepath), {
      filename: file.originalFilename || 'upload.jpg',
      contentType: file.mimetype || 'image/jpeg',
    });

    // Forward the request to the Flask API
    const apiResponse = await axios.post(`${API_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Return the API response
    return res.status(200).json(apiResponse.data);
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}