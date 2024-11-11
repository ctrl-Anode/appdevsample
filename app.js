const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebaseServiceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());
const db = admin.firestore()

app.use(cors({
    origin: 'http://localhost:8080',  // Allow only this origin
  }));

// Routes for CRUD operations
// Add item (POST)
app.post('/items', async (req, res) => {
  const { name, age, description } = req.body; // Include description
  const response = await db.collection('items').add({ name, age, description });
  res.status(201).json({ id: response.id });
});

// Update item (PUT)
app.put('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const { name, age, description } = req.body; // Include description
  await db.collection('items').doc(itemId).update({ name, age, description });
  res.status(200).json({ message: 'Item updated' });
});


// Read
app.get('/items', async (req, res) => {
  const snapshot = await db.collection('items').get();
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.send(items);
});

// Delete
app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  await db.collection('items').doc(id).delete();
  res.status(204).send();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

