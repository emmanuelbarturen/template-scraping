import { run as runApiCron } from './src/schedulers/api.cron.js';
import { run as runHtmlCron } from './src/schedulers/html.cron.js';
import { run as runBrowserCron } from './src/schedulers/browser.cron.js';
import logger from './src/utils/logger.js';

async function main() {
  const type = (process.env.SCRAPER_TYPE || '').toLowerCase();

  if (!type) {
    throw new Error('SCRAPER_TYPE env var is required (api | html | browser)');
  }

  logger.info('Starting scraper job', { type, name: process.env.SCRAPER_NAME });

  switch (type) {
    case 'api':
      await runApiCron();
      break;
    case 'html':
    case 'cheerio':
      await runHtmlCron();
      break;
    case 'browser':
    case 'puppeteer':
      await runBrowserCron();
      break;
    default:
      throw new Error(`Unknown SCRAPER_TYPE: ${type}`);
  }
}

main().catch((err) => {
  logger.error('Unhandled error in app entry point', { error: err.message });
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
