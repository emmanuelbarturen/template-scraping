import logger from '../../utils/logger.js';
import linkedinTalentsApiScraper from './linkedin.talents.api.scraper.js';

// Registry of API-based scrapers
// Each scraper is a function that returns a Promise
const apiScrapers = {
  'linkedin-talents': linkedinTalentsApiScraper,
};

export async function runApiScraper(name, options = {}) {
  const scraper = apiScrapers[name];
  if (!scraper) {
    throw new Error(`API scraper not found: ${name}`);
  }
  logger.info('Running API scraper', { name, options });
  return scraper(options);
}
