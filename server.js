const express = require('express');
const fs      = require('fs');
const path    = require('path');
const cors    = require('cors');
const multer  = require('multer');

const app  = express();
const port = process.env.PORT || 3000;

// ─── CSP-Header entfernen (nur JSON, kein HTML) ────────────────────────────────
app.use((req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  next();
});

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Multer für Bild-Uploads ───────────────────────────────────────────────────
const imgUploadDir = path.join(__dirname, 'src', 'assets', 'images', 'uploads');
const storageImg = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imgUploadDir),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const uploadImg = multer({ storage: storageImg });

// ─── Multer für Dokument-Uploads ───────────────────────────────────────────────
const docUploadDir = path.join(__dirname, 'src', 'assets', 'docs');
const storageDoc = multer.diskStorage({
  destination: (req, file, cb) => cb(null, docUploadDir),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const uploadDoc = multer({ storage: storageDoc });

// ─── Statische Assets ──────────────────────────────────────────────────────────
// Forum-Bilder
app.use(
  '/assets/images/uploads',
  express.static(imgUploadDir)
);
// JSON-Dateien
app.use(
  '/assets/json',
  express.static(path.join(__dirname, 'src', 'assets', 'json'))
);
// Docs allgemein (z.B. unter /assets/docs)
app.use(
  '/assets/docs',
  express.static(docUploadDir)
);
// Neue Route: serve docs auch unter /docs so dass /docs/tasks/... klappt
app.use(
  '/docs',
  express.static(docUploadDir)
);

// ─── Tasks-API ─────────────────────────────────────────────────────────────────
const TASKS_FILE = path.join(__dirname, 'src', 'assets', 'json', 'tasks.json');
if (!fs.existsSync(TASKS_FILE)) {
  console.error('❌ tasks.json nicht gefunden unter', TASKS_FILE);
  process.exit(1);
}

app.get('/api/tasks', (req, res) => {
  fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Kann Tasks nicht lesen.' });
    try {
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Ungültiges JSON in tasks.json.' });
    }
  });
});

app.put('/api/tasks', (req, res) => {
  fs.writeFile(TASKS_FILE, JSON.stringify(req.body, null, 2), 'utf8', err => {
    if (err) return res.status(500).json({ error: 'Kann Tasks nicht speichern.' });
    res.json({ success: true });
  });
});

app.post('/api/tasks/uploadDoc', uploadDoc.single('document'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Kein Dokument hochgeladen.' });
  res.json({ path: `/docs/${req.file.filename}` });
});

// ─── Feedback API ───────────────────────────────────────────────────────────────
const feedbackPath = path.join(__dirname, 'src', 'assets', 'json', 'feedback.json');
app.post('/api/feedback', (req, res) => {
  try {
    const entry = {
      rating: Number(req.body.rating),
      feedbackText: String(req.body.feedbackText),
      createdAt: new Date().toISOString()
    };
    const current = JSON.parse(fs.readFileSync(feedbackPath, 'utf-8'));
    current.push(entry);
    fs.writeFileSync(feedbackPath, JSON.stringify(current, null, 2), 'utf-8');
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Fehler beim Speichern des Feedbacks' });
  }
});

// ─── Forum Posts API ───────────────────────────────────────────────────────────
const postsPath = path.join(__dirname, 'src', 'assets', 'json', 'posts.json');

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
    const current = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
    current.push(post);
    fs.writeFileSync(postsPath, JSON.stringify(current, null, 2), 'utf-8');
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Fehler beim Speichern des Posts' });
  }
});

app.get('/api/posts', (req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync(postsPath, 'utf-8')));
  } catch {
    res.status(500).json({ error: 'Fehler beim Laden der Posts' });
  }
});

// ─── Forum Image Upload ────────────────────────────────────────────────────────
app.post('/api/upload', uploadImg.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Kein Bild hochgeladen' });
  res.json({ imageUrl: `/assets/images/uploads/${req.file.filename}` });
});

// ─── Gamification Leaderboard ──────────────────────────────────────────────────
app.get('/api/gamification/leaderboard', (req, res) => {
  const usersPath = path.join(__dirname, 'src', 'assets', 'json', 'user.json');
  try {
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    const board = users
      .filter(u => !u.isAdmin)
      .map(u => ({ name: u.name, points: u.totalPoints }))
      .sort((a, b) => b.points - a.points);
    res.json(board);
  } catch {
    res.status(500).json({ error: 'Fehler beim Laden des Leaderboards' });
  }
});

// ─── Likes & Comments ───────────────────────────────────────────────────────────
app.post('/api/posts/like/:id', (req, res) => {
  const id = Number(req.params.id);
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  const post = posts.find(p => p.id === id);
  if (post) {
    post.likes = (post.likes || 0) + 1;
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Post nicht gefunden' });
  }
});

app.post('/api/posts/comment/:id', (req, res) => {
  const id = Number(req.params.id);
  const { comment } = req.body;
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  const post = posts.find(p => p.id === id);
  if (post) {
    post.comments = post.comments || [];
    post.comments.push({ text: comment, createdAt: new Date().toISOString() });
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Post nicht gefunden' });
  }
});

// ─── 404 Handler for all other routes ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).send('404: Nicht gefunden');
});

// ─── Start Server ───────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`✅ Server läuft auf http://localhost:${port}`);
});
