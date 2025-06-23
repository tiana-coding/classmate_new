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

// Forum 
// Neuer POST-Endpunkt
app.post('/api/posts', (req, res) => {
  try {
    const post = {
      id: Date.now(),
      title: req.body.title,
      details: req.body.details,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl || null,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    const raw = fs.readFileSync('src/assets/json/posts.json', 'utf-8');
    const current = JSON.parse(raw);

    current.push(post);
    fs.writeFileSync('src/assets/json/posts.json', JSON.stringify(current, null, 2), 'utf-8');

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    res.status(500).json({ error: 'Fehler beim Speichern des Posts' });
  }
});

// Neuer GET-Endpunkt
app.get('/api/posts', (req, res) => {
  try {
    const raw = fs.readFileSync('src/assets/json/posts.json', 'utf-8');
    const data = JSON.parse(raw);
    res.status(200).json(data);
  } catch (err) {
    console.error('Fehler beim Laden:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Posts' });
  }
});


app.listen(port, () => {
  console.log(`✅ Server läuft auf http://localhost:${port}`);
});
