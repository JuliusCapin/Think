const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { extractText } = require('../services/extractor');
const { generateQuiz } = require('../services/quizGenerator');

router.post('/generate-quiz', upload.single('document'), async (req, res) => {
  try {
    const { numQuestions = 5, quizType = 'multiple_choice' } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const text = await extractText(req.file);
    if (!text || text.trim().length < 100)
      return res.status(400).json({ error: 'Document has too little content' });

    const quiz = await generateQuiz(text, numQuestions, quizType);
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;