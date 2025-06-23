const express = require('express');
const fs = require('fs');
const path = require('path'); // <- muss vor Verwendung kommen
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const uploadFolder = path.join(__dirname, 'src', 'assets', 'images', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

const app = express();
const port = 3000;


// 🧠 JSON-Parsing und Größenlimit (für base64-Bilder)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 📁 Pfade zu JSON-Dateien
app.use('/assets/images/uploads', express.static(path.join(__dirname, 'src', 'assets', 'images', 'uploads')));
const feedbackPath = path.join(__dirname, 'src', 'assets', 'json', 'feedback.json');
const postsPath = path.join(__dirname, 'src', 'assets', 'json', 'posts.json');


// 📮 Feedback POST
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
  } catch (err) {
    console.error('❌ Fehler beim Speichern des Posts:', err);
    console.error('Request body war:', req.body);
    res.status(500).json({ error: 'Fehler beim Speichern des Posts' });
  }
});

// 📮 Forum POST
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

    const raw = fs.readFileSync(postsPath, 'utf-8');
    const current = JSON.parse(raw);
    current.push(post);

    fs.writeFileSync(postsPath, JSON.stringify(current, null, 2), 'utf-8');
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Fehler beim Speichern des Posts:', err);
    console.error('📦 Request-Body war:', req.body); // <-- wichtig
    res.status(500).json({ error: 'Fehler beim Speichern des Posts' });
  }
});

// 📄 Forum GET
app.get('/api/posts', (req, res) => {
  try {
    const raw = fs.readFileSync(postsPath, 'utf-8');
    const data = JSON.parse(raw);
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Fehler beim Laden der Posts:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Posts' });
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Kein Bild hochgeladen' });
  }

  const relativePath = `/assets/images/uploads/${req.file.filename}`; 
  res.status(200).json({ imageUrl: relativePath });
});

// 📊 Leaderboard GET
app.get('/api/gamification/leaderboard', (req, res) => {
  const usersPath = path.join(__dirname, 'src', 'assets', 'json', 'user.json');

  fs.readFile(usersPath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Fehler beim Lesen der user.json:', err);
      return res.status(500).json({ error: 'Fehler beim Laden der Nutzerdaten' });
    }

    try {
      const allUsers = JSON.parse(data);
      const leaderboard = allUsers
        .filter(user => !user.isAdmin)
        .map(user => ({
          name: user.name,
          points: user.totalPoints
        }))
        .sort((a, b) => b.points - a.points);

      res.json(leaderboard);
    } catch (parseError) {
      console.error('❌ Fehler beim Parsen der user.json:', parseError);
      res.status(500).json({ error: 'Fehler beim Parsen der Nutzerdaten' });
    }
  });
});

// ❤️ Like hinzufügen
app.post('/api/posts/like/:id', (req, res) => {
  const postId = Number(req.params.id);
  const raw = fs.readFileSync(postsPath, 'utf-8');
  const posts = JSON.parse(raw);

  const post = posts.find(p => p.id === postId);
  if (post) {
    post.likes = (post.likes || 0) + 1;
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: 'Post nicht gefunden' });
  }
});

// 💬 Kommentar hinzufügen
app.post('/api/posts/comment/:id', (req, res) => {
  const postId = Number(req.params.id);
  const { comment } = req.body;
  const raw = fs.readFileSync(postsPath, 'utf-8');
  const posts = JSON.parse(raw);

  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments = post.comments || [];
    post.comments.push({
      text: comment,
      createdAt: new Date().toISOString()
    });
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: 'Post nicht gefunden' });
  }
});

app.post('/api/posts/:id/comment', (req, res) => {
  const postId = Number(req.params.id);
  const { text, createdAt } = req.body;

  try {
    const raw = fs.readFileSync(postsPath, 'utf-8');
    const posts = JSON.parse(raw);

    const post = posts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: 'Post nicht gefunden' });
    }

    post.comments = post.comments || [];
    post.comments.push({ text, createdAt });

    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
    res.status(200).json(post);
  } catch (err) {
    console.error('Fehler beim Speichern des Kommentars:', err);
    res.status(500).json({ error: 'Interner Fehler beim Speichern' });
  }
});



// 🟢 Server starten
app.listen(port, () => {
  console.log(`✅ Server läuft auf http://localhost:${port}`);
});
