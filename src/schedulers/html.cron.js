const { runHtmlScraper } = require('../scrapers/html');
const logger = require('../utils/logger');

// Entry point for cron jobs that use Cheerio/HTML scrapers
async function run() {
  const name = process.env.SCRAPER_NAME;
  if (!name) {
    throw new Error('SCRAPER_NAME env var is required for HTML cron job');
  }

  try {
    await runHtmlScraper(name);
    logger.info('HTML cron job finished successfully', { name });
  } catch (err) {
    logger.error('HTML cron job failed', { name, error: err.message });
    process.exitCode = 1;
  }
}

module.exports = { run };
