const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import face recognition modules
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const sharp = require('sharp');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database setup
const db = new sqlite3.Database('./face_recognition.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    cin TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Face data table
  db.run(`CREATE TABLE IF NOT EXISTS face_data (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    cin TEXT NOT NULL,
    face_descriptor TEXT NOT NULL,
    image_metadata TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Verification attempts table
  db.run(`CREATE TABLE IF NOT EXISTS verification_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    cin TEXT,
    confidence REAL,
    success BOOLEAN,
    verification_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Configure face-api.js
async function initializeFaceAPI() {
  try {
    // Load models (you'll need to download these models)
    const modelPath = path.join(__dirname, 'models');
    
    // Check if models directory exists
    try {
      await fs.access(modelPath);
    } catch {
      console.log('Creating models directory...');
      await fs.mkdir(modelPath, { recursive: true });
      console.log('Please download face-api.js models to:', modelPath);
      console.log('Models needed: tiny_face_detector_model-weights_manifest.json, tiny_face_detector_model-shard1');
      console.log('Also: face_landmark_68_model-weights_manifest.json, face_landmark_68_model-shard1');
      console.log('And: face_recognition_model-weights_manifest.json, face_recognition_model-shard1');
    }

    // For now, we'll simulate face detection without actual models
    console.log('Face recognition service initialized (simulation mode)');
  } catch (error) {
    console.error('Error initializing Face API:', error);
  }
}

// Helper functions
function generateFaceDescriptor(imageData) {
  // Simulate face descriptor generation
  // In production, this would use actual face-api.js
  const descriptor = [];
  for (let i = 0; i < 128; i++) {
    descriptor.push(Math.random());
  }
  return descriptor;
}

function calculateEuclideanDistance(descriptor1, descriptor2) {
  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    sum += Math.pow(descriptor1[i] - descriptor2[i], 2);
  }
  return Math.sqrt(sum);
}

function calculateSimilarity(descriptor1, descriptor2) {
  const distance = calculateEuclideanDistance(descriptor1, descriptor2);
  // Convert distance to similarity (0-1)
  return Math.max(0, 1 - (distance / 2));
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register face
app.post('/api/face-recognition/register', async (req, res) => {
  try {
    const { userId, cin, imageBase64, imageMetadata } = req.body;

    if (!userId || !cin || !imageBase64) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, cin, imageBase64' 
      });
    }

    // Validate CIN format
    if (!/^\d{10,18}$/.test(cin.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        error: 'Invalid CIN format' 
      });
    }

    // Extract base64 data
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Analyze image quality
    const imageInfo = await sharp(buffer).metadata();
    
    if (imageInfo.width < 200 || imageInfo.height < 200) {
      return res.status(400).json({ 
        error: 'Image too small. Minimum 200x200 pixels required.' 
      });
    }

    // Generate face descriptor
    const faceDescriptor = generateFaceDescriptor(buffer);

    // Check if user already has face data
    db.get(
      'SELECT * FROM face_data WHERE user_id = ? OR cin = ?',
      [userId, cin],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
          return res.status(409).json({ 
            error: 'Face data already exists for this user/CIN' 
          });
        }

        // Insert user if not exists
        db.run(
          'INSERT OR IGNORE INTO users (id, cin) VALUES (?, ?)',
          [userId, cin],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create user' });
            }

            // Insert face data
            const faceDataId = uuidv4();
            db.run(
              'INSERT INTO face_data (id, user_id, cin, face_descriptor, image_metadata) VALUES (?, ?, ?, ?, ?)',
              [faceDataId, userId, cin, JSON.stringify(faceDescriptor), JSON.stringify(imageMetadata)],
              function(err) {
                if (err) {
                  return res.status(500).json({ error: 'Failed to save face data' });
                }

                res.json({
                  success: true,
                  verificationId: faceDataId,
                  message: 'Face registered successfully'
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify face
app.post('/api/face-recognition/verify', async (req, res) => {
  try {
    const { imageBase64, cin, deviceId } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ 
        error: 'Missing required field: imageBase64' 
      });
    }

    // Extract base64 data
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate face descriptor for verification image
    const verificationDescriptor = generateFaceDescriptor(buffer);

    // Query face data
    let query = 'SELECT * FROM face_data';
    let params = [];

    if (cin) {
      query += ' WHERE cin = ?';
      params.push(cin);
    }

    db.all(query, params, async (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ 
          error: 'No face data found for verification' 
        });
      }

      let bestMatch = null;
      let bestConfidence = 0;

      // Compare with stored face descriptors
      for (const row of rows) {
        const storedDescriptor = JSON.parse(row.face_descriptor);
        const confidence = calculateSimilarity(verificationDescriptor, storedDescriptor);

        if (confidence > bestConfidence) {
          bestConfidence = confidence;
          bestMatch = row;
        }
      }

      const verificationId = uuidv4();
      const success = bestConfidence > 0.8; // 80% confidence threshold

      // Log verification attempt
      db.run(
        'INSERT INTO verification_attempts (id, user_id, cin, confidence, success, verification_id) VALUES (?, ?, ?, ?, ?, ?)',
        [verificationId, bestMatch?.user_id, cin, bestConfidence, success, verificationId]
      );

      res.json({
        success,
        confidence: bestConfidence,
        userId: bestMatch?.user_id,
        verificationId,
        message: success ? 'Face verified successfully' : 'Face verification failed'
      });
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if user has face data
app.get('/api/face-recognition/check', (req, res) => {
  const { userId, cin } = req.query;

  if (!userId && !cin) {
    return res.status(400).json({ 
      error: 'Missing userId or cin parameter' 
    });
  }

  let query = 'SELECT COUNT(*) as count FROM face_data WHERE ';
  let params = [];

  if (userId && cin) {
    query += 'user_id = ? OR cin = ?';
    params = [userId, cin];
  } else if (userId) {
    query += 'user_id = ?';
    params = [userId];
  } else {
    query += 'cin = ?';
    params = [cin];
  }

  db.get(query, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      hasFaceData: row.count > 0
    });
  });
});

// Delete face data
app.delete('/api/face-recognition/delete', (req, res) => {
  const { userId, cin } = req.body;

  if (!userId && !cin) {
    return res.status(400).json({ 
      error: 'Missing userId or cin' 
    });
  }

  let query = 'DELETE FROM face_data WHERE ';
  let params = [];

  if (userId && cin) {
    query += 'user_id = ? OR cin = ?';
    params = [userId, cin];
  } else if (userId) {
    query += 'user_id = ?';
    params = [userId];
  } else {
    query += 'cin = ?';
    params = [cin];
  }

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      success: true,
      deletedCount: this.changes,
      message: `Deleted ${this.changes} face data records`
    });
  });
});

// Analyze image quality
app.post('/api/face-recognition/analyze-quality', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ 
        error: 'Missing imageBase64 field' 
      });
    }

    // Extract base64 data
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Analyze image with sharp
    const metadata = await sharp(buffer).metadata();
    const stats = await sharp(buffer).stats();

    // Quality checks
    const issues = [];
    const recommendations = [];

    if (metadata.width < 300 || metadata.height < 300) {
      issues.push('Image resolution too low');
      recommendations.push('Use a higher resolution image (minimum 300x300)');
    }

    if (metadata.width > 2000 || metadata.height > 2000) {
      issues.push('Image resolution too high');
      recommendations.push('Use a smaller image (maximum 2000x2000)');
    }

    // Check brightness (simplified)
    const avgBrightness = stats.channels.reduce((sum, ch) => sum + ch.mean, 0) / stats.channels.length;
    if (avgBrightness < 50) {
      issues.push('Image too dark');
      recommendations.push('Increase lighting or use a brighter environment');
    } else if (avgBrightness > 200) {
      issues.push('Image too bright');
      recommendations.push('Reduce lighting or avoid overexposure');
    }

    // Check if image is square (for better face detection)
    const aspectRatio = metadata.width / metadata.height;
    if (aspectRatio < 0.8 || aspectRatio > 1.2) {
      issues.push('Image not square enough');
      recommendations.push('Use a square image for better face detection');
    }

    const isGoodQuality = issues.length === 0;

    res.json({
      isGoodQuality,
      issues,
      recommendations,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: buffer.length
      }
    });
  } catch (error) {
    console.error('Quality analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze image quality' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
  await initializeFaceAPI();
  
  app.listen(PORT, () => {
    console.log(`Face recognition server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error);

module.exports = app;
