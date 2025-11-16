const logger = require('../../utils/logger');

// Registry of Cheerio/HTML scrapers
const htmlScrapers = {
  'linkedin-talents': require('./linkedin.talents.html.scraper'),
};

async function runHtmlScraper(name, options = {}) {
  const scraper = htmlScrapers[name];
  if (!scraper) {
    throw new Error(`HTML scraper not found: ${name}`);
  }
  logger.info('Running HTML scraper', { name, options });
  return scraper(options);
}

module.exports = {
  runHtmlScraper,
};
