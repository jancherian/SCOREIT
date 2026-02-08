const express = require('express');
const upload = require('../middleware/upload');

const router = express.Router();

// POST /api/upload/logo — handle logo upload
router.post('/logo', upload.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(201).json({
    filename: req.file.filename,
    url: fileUrl,
  });
});

module.exports = router;


