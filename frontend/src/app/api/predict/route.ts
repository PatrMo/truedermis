import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import * as os from 'os';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file temporarily (use os.tmpdir() for cross-platform temp directory)
    const tempPath = join(os.tmpdir(), file.name);
    await writeFile(tempPath, buffer);
    
    // Create form data for the API request
    const apiFormData = new FormData();
    apiFormData.append('file', createReadStream(tempPath), {
      filename: file.name,
      contentType: file.type,
    });
    
    // Forward the request to the Flask API
    const apiResponse = await axios.post(`${API_URL}/predict`, apiFormData, {
      headers: {
        ...apiFormData.getHeaders(),
      },
    });
    
    // Return the API response
    return NextResponse.json(apiResponse.data);
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}