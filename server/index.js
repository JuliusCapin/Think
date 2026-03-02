require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const quizRoute = require('./routes/quiz');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use('/api', quizRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at \x1b]8;;http://localhost:${PORT}\x07http://localhost:${PORT}\x1b]8;;\x07`));