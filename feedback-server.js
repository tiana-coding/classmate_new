const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const feedbackPath = path.join(__dirname, 'src', 'assets', 'json', 'feedback.json');

app.use(cors());
app.use(bodyParser.json());

app.post('/api/feedback', (req, res) => {
  try {
    const feedbackEntry = {
      rating: Number(req.body.rating),
      feedbackText: String(req.body.feedbackText),
      createdAt: new Date().toISOString()
    };

    const raw = fs.readFileSync(feedbackPath, 'utf-8');
    const current = JSON.parse(raw);

    current.push(feedbackEntry);

    fs.writeFileSync(feedbackPath, JSON.stringify(current, null, 2), 'utf-8');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Fehler beim Speichern:', error);
    res.status(500).json({ error: 'Fehler beim Speichern von Feedback' });
  }
});

app.listen(port, () => {
  console.log(`✅ Feedback-Server läuft auf http://localhost:${port}`);
});
