import logger from '../../utils/logger.js';
import linkedinTalentsBrowserScraper from './linkedin.talents.browser.scraper.js';

// Registry of Puppeteer/browser scrapers
const browserScrapers = {
  'linkedin-talents': linkedinTalentsBrowserScraper,
};

export async function runBrowserScraper(name, options = {}) {
  const scraper = browserScrapers[name];
  if (!scraper) {
    throw new Error(`Browser scraper not found: ${name}`);
  }
  logger.info('Running browser scraper', { name, options });
  return scraper(options);
}
