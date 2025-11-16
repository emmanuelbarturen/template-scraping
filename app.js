import express from 'express';
import { executeScraper, initializeJobs } from './src/utils/scheduler.js';
import jobsConfig from './src/config/jobs.config.js';
import logger from './src/utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Ejecutar scraper manualmente vía HTTP
app.post('/scraper/run', async (req, res) => {
  const { type, name, options = {} } = req.body;

  if (!type || !name) {
    return res.status(400).json({ error: 'type and name are required' });
  }

  logger.info('Manual scraper execution requested', { type, name });

  try {
    const result = await executeScraper(type, name, options);
    logger.info('Scraper executed successfully', { type, name });
    res.json({ success: true, type, name, result });
  } catch (error) {
    logger.error('Scraper execution failed', { type, name, error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Inicializar jobs programados desde configuración
const scheduledJobs = initializeJobs(jobsConfig);
logger.info('Jobs initialization completed', { total: scheduledJobs.length });

// Iniciar servidor
app.listen(PORT, () => {
  logger.info('Scraper service started', { port: PORT, env: process.env.NODE_ENV });
  logger.info('Available endpoints:', {
    health: `GET http://localhost:${PORT}/health`,
    runScraper: `POST http://localhost:${PORT}/scraper/run`,
  });
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message });
  process.exit(1);
});
