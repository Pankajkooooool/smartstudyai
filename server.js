const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs')
const vision = require('@google-cloud/vision'); // Replace with your chosen OCR library

const app = express();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Specify a directory to store uploaded files temporarily
app.use( cors({
    origin: 'http://localhost:3000', 
  }));
// Replace with your Google Cloud Vision credentials (if using Google Cloud Vision)
const projectId = 'totemic-effect-427302-k0';
const credentials = {
  "type": "service_account",
  "project_id": "totemic-effect-427302-k0",
  "private_key_id": "3b6265039729d5f0768eae7abba8c70a1d22ec06",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2wN70fzTqNmUd\n8KHW1vbZUmuop1e6lHkiDbKR1Qvi6uYwxkkAiPCZ6Ypv5FyjGA+0gMkJmPMH1i8r\nEF9d8eTsxHkIXVTCg8RSAWVGmjulrv57sWjVU/zTXczn1mWR4Qz3wP4uNX4zrqye\n4miNp7F0+UAOsQMEbqzjq9FFL2Dmcmu0VD6LC4i+ccFDRYWmsw9aeUfnOagr821w\nYs9aTvfv3VQs09pJteYZpWg0onD0lKAtVQFXGfIYq8CKfHXWXZVv2fBtlyznOEjE\n6B55hFy1A4EKiGWqmP7D2CuvNZJPHWaJNPx1OJIYOfbxOZPmElnmtnTZ0IRX84YV\nZzX5l5VRAgMBAAECggEADx2ei01Cto0TecGblzoePn0mVbOqqk5pwv7sSkrbcfRB\nIB9kbiCFewuBpW3XWi+NK/47cplln5wv+FFBPBNb/pflFWOn1TNiH3DJXEi5PoPd\n/WPgAoYQ+zgO0M2vRry9LnhWZcLLqpFr6nPaVz4bq8vKaDSspdcUInwlgeIQcxr3\nZVpgr87ZwWoSSwWqoOFTVKsgHIHvHBovVUqBWQ9EcqXsUMFt613Upa/N2mfA2D/F\nURmFqCY8IW296c/O4NQvElOyzFHPS4OYu8Qy50rpybmN3oW3w6BVPXp5ci3cQKsU\nVciNF4redyzBrXyFOByMqFRb4RaNS5ieZd3KqC4ziQKBgQDzU3ErQl9VesqpwLSg\nkNjDYR0ImP9IqPAvlT+HbiLN2MGmbK9U2Ygc9DisQSVrn2pIvSDl1SMYX82kM5zo\nnnDkUSgLkOqDSFlS94N53uaQtqIfymjVsm09SmMSuqxtSOIvvWIdVOdTFRLtHcnS\nD66U13rQdFmkTz1O31KtrnJ0OQKBgQDARb3+jGBx8hUDxsmPaE0tqRaZCt5K5Tyj\nJzjnhG7TM9KFFea6bLy3uXjSihQZn1qFldDP9Dwzsxmi0lmDKhiPBX+S1vFueJ3D\nbGdhScQ314Ue0nI7R/BNoSpLHutYOpinDi7dKXIiLBf/ZR3eG8DoDfaFfqI6qV7R\nAbtd3gWZ2QKBgHRjkVpT4S4OEiqolr3HCyhJp42ZQWMMC/d2uHCbaeJ0sAxfKG65\nrrXKy+D5OGEGW9x3Ouk0zhi2mrLUTVWnk/BiMXl20/YAAVoCMs10pWzLLzltpD+z\nnTUYA9PNnvSXTDnxqKDHH+9JwUfSW9syzRs9Bu32+XnyvSyg/fc93llhAoGBAJGj\nAhPSbqdAj+xpYXkvru38GvLXiaM/WhvW9MJgzLVLlpVaDod9H8EmSr9m+WyjCKUQ\n4rbxr7wVWEC9hjHU6/9BUe1+xCdCU3WYIgJOJsOJivraus3uYrXacret9uPAlqpL\nEvJQl3QM5Cx+gg4gBZGAKg/Z6LX4Xqp/3lVue92ZAoGALIP9iLwTO9cVMvKsAUlx\npRhXj7DuJlB2n7BmWEEcSqO3GsdZqdJ5T7rqPOOI/uPihyJNAe0vXZ8r839bCXB0\nwr9+bkfzmK1y6EoZe3rCstR68HAB87irVenaHK606HHxjtcXzXzseio8kj5rFGPK\nMUysZJEHR7c+BwLnHq7O+2I=\n-----END PRIVATE KEY-----\n",
  "client_email": "smartstudyai@totemic-effect-427302-k0.iam.gserviceaccount.com",
  "client_id": "105470020064678311305",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/smartstudyai%40totemic-effect-427302-k0.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


app.get('/', (req, res) => {
  // Render HTML form for uploading PDF
  res.sendFile(__dirname + '/index.html'); // Replace with your HTML file path
});

app.post('/api/extract-text', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }
    
    if (req.file.mimetype.startsWith('image/')) {
        const imageContent = fs.readFileSync(req.file.path); // Read the uploaded image
    
        // Create an OCR client object (replace with your chosen library's method)
        const client = new vision.ImageAnnotatorClient({ projectId, credentials });
    
        // Define the image data
        const image = {
          content: imageContent.toString('base64'), // Convert to base64 for the API
        };
        try {
          // Perform text extraction with handwritten text detection (replace with your chosen library's call)
          const response = await client.textDetection(image);
          const extractedText = response.fullTextAnnotation.text;
    
          // Delete the temporary uploaded file
          fs.unlinkSync(req.file.path);
    
          res.json({ extractedText });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to extract text' });
        }
      } else {
        // Handle non-image files
        res.status(400).json({ error: 'Only image files are allowed' });
        fs.unlinkSync(req.file.path); // Delete the uploaded non-image file
    }
});

app.listen(3002, () => console.log('Server listening on port 3002'));
