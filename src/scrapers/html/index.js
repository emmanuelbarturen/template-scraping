import logger from '../../utils/logger.js';
import linkedinTalentsHtmlScraper from './linkedin.talents.html.scraper.js';

// Registry of Cheerio/HTML scrapers
const htmlScrapers = {
  'linkedin-talents': linkedinTalentsHtmlScraper,
};

export async function runHtmlScraper(name, options = {}) {
  const scraper = htmlScrapers[name];
  if (!scraper) {
    throw new Error(`HTML scraper not found: ${name}`);
  }
  logger.info('Running HTML scraper', { name, options });
  return scraper(options);
}
