# TrueDermis - Skin Condition Classifier [truedermis.org](https://www.truedermis.org/)
#### !!!Backend Connection is currently down due to AWS hosting costs!!!

TrueDermis is a web application that allows users to upload images of skin conditions and receive instant classification results using a deep learning model. This tool is designed for educational purposes and should not be used for self-diagnosis. Always consult a healthcare professional for proper diagnosis and treatment of skin conditions.

## Features

- Upload images of skin conditions
- Receive instant classification results
- View detailed predictions with probabilities
- Responsive design for mobile and desktop

## Technologies Used

- React
- Next.js
- Tailwind CSS
- Axios
- Formidable
- Flask (Backend API)

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Python (for the Flask backend)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/truedermis.git
   cd truedermis

2. Install the dependencies for the frontend:

    ```bash
    cd frontend
    npm install

3. Install the dependencies for the backend:

    ```bash
    cd backend
    py -m vevn .venv
    .venv\\Scripts\\Activate
    pip install -r requirements.txt

### Running the Application

1. Start the Flask backend:

    ```bash
    cd backend
    .venv\\Scripts\\Activate
    py app.py

2. Start the Next.js frontend:

    ```bash
    cd frontend
    npm run dev

3. Open your browser and navigate to http://localhost:3000.

## Usage

1. Drag and drop an image of a skin condition or click to upload.
2. Wait for the image to be processed.
3. View the classification results and probabilities.

## API TEST - Frontend

Navigate to the browser search bar and append /ApiTest to http://localhost:3000.
It should end up looking like http://localhost:3000/ApiTest. Load that page to test api.

## Project Structure

The project is organized as follows:

```
truedermis/
├── backend/            # Flask backend
│   ├── app.py          # Main application file
│   ├── class_labels    # Labels of each class
│   └── skin_disease... # Machine learning model
├── frontend/           # Next.js frontend
│   ├── components/     # React components
│   ├── src/app         # Next.js pages
│   │   ├── pages       # page views
│   │   └── Components/ # Frontend components
│   └── public/         # Public assets
├── .gitignore          # Git ignore file
├── README.md           # Project README
└── package.json        # Frontend package file
```
