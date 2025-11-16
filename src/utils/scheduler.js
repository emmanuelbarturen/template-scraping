import cron from 'node-cron';
import { runApiScraper } from '../scrapers/api/index.js';
import { runHtmlScraper } from '../scrapers/html/index.js';
import { runBrowserScraper } from '../scrapers/browser/index.js';
import logger from './logger.js';

// Ejecutar un scraper según su tipo
async function executeScraper(type, name, options = {}) {
  switch (type.toLowerCase()) {
    case 'api':
      return await runApiScraper(name, options);
    case 'html':
    case 'cheerio':
      return await runHtmlScraper(name, options);
    case 'browser':
    case 'puppeteer':
      return await runBrowserScraper(name, options);
    default:
      throw new Error(`Unknown scraper type: ${type}`);
  }
}

// Inicializar jobs programados desde configuración
export function initializeJobs(jobsConfig) {
  const scheduledJobs = [];

  jobsConfig.forEach((job) => {
    if (!job.enabled) {
      logger.info('Job disabled, skipping', { name: job.name });
      return;
    }

    if (!cron.validate(job.schedule)) {
      logger.error('Invalid cron schedule', { name: job.name, schedule: job.schedule });
      return;
    }

    const task = cron.schedule(job.schedule, async () => {
      logger.info('Running scheduled job', { name: job.name, type: job.type, scraper: job.scraper });
      try {
        await executeScraper(job.type, job.scraper, job.options);
        logger.info('Scheduled job completed successfully', { name: job.name });
      } catch (error) {
        logger.error('Scheduled job failed', { name: job.name, error: error.message });
      }
    });

    scheduledJobs.push({ name: job.name, task });
    logger.info('Job scheduled', { name: job.name, schedule: job.schedule });
  });

  return scheduledJobs;
}

export { executeScraper };
