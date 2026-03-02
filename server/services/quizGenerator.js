const Groq = require('groq-sdk');

async function generateQuiz(text, numQuestions = 5, quizType = 'multiple_choice') {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{
      role: 'user',
      content: `Based on the following document, generate ${numQuestions} ${quizType} quiz questions.

Return ONLY valid JSON, no markdown, no backticks, just raw JSON:
{
  "questions": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "A",
      "explanation": "..."
    }
  ]
}

Document:
${text.slice(0, 8000)}`
    }],
    temperature: 0.7,
  });

  const raw = response.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { generateQuiz };