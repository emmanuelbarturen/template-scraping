import { runBrowserScraper } from '../scrapers/browser/index.js';
import logger from '../utils/logger.js';

// Entry point for cron jobs that use Puppeteer/browser scrapers
export async function run() {
  const name = process.env.SCRAPER_NAME;
  if (!name) {
    throw new Error('SCRAPER_NAME env var is required for BROWSER cron job');
  }

  try {
    await runBrowserScraper(name);
    logger.info('Browser cron job finished successfully', { name });
  } catch (err) {
    logger.error('Browser cron job failed', { name, error: err.message });
    process.exitCode = 1;
  }
}
