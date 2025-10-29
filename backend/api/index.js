import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Backend is running on Vercel'
  });
});

// Catch all for now
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;