// server/index.js

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`)
});

const upload = multer({ storage });

app.post('/api/analyze', (req, res) => {
  upload.single('contract')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error during file upload:', err.message);
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}. Expected field 'contract'.` });
    } else if (err) {
      console.error('Unknown upload error:', err.message);
      return res.status(500).json({ success: false, error: `Server error during upload: ${err.message}` });
    }

    if (!req.file) {
      console.error('No file received after Multer processing, despite no Multer error.');
      return res.status(400).json({ success: false, error: 'No file uploaded or file not found.' });
    }

    try {
      const filePath = req.file.path;
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await axios.post('http://localhost:5000/analyze', formData, {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      fs.unlinkSync(filePath);
      res.json(response.data);
    } catch (error) { // FIX: Removed ': any' type annotation here
      console.error('Error forwarding to Flask or processing Flask response:');
      if (axios.isAxiosError(error) && error.response) {
        console.error('Flask app response status:', error.response.status);
        console.error('Flask app response data:', error.response.data);
        return res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || `Flask service responded with an error (Status: ${error.response.status})`,
        });
      } else {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error during analysis forwarding.' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Node.js proxy server running on http://localhost:${port}`);
});