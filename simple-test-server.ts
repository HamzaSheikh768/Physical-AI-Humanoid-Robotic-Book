import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Translation server is running!' });
});

app.listen(port, () => {
  console.log(`Translation proxy server running at http://localhost:${port}`);
});