import { runApiScraper } from '../scrapers/api/index.js';
import logger from '../utils/logger.js';

// Entry point for cron jobs that use API scrapers
// Example cron usage:
//   SCRAPER_TYPE=api SCRAPER_NAME=linkedin-talents node app.js

export async function run() {
  const name = process.env.SCRAPER_NAME;
  if (!name) {
    throw new Error('SCRAPER_NAME env var is required for API cron job');
  }

  try {
    await runApiScraper(name);
    logger.info('API cron job finished successfully', { name });
  } catch (err) {
    logger.error('API cron job failed', { name, error: err.message });
    process.exitCode = 1;
  }
}
