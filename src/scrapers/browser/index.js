const logger = require('../../utils/logger');

// Registry of Puppeteer/browser scrapers
const browserScrapers = {
  'linkedin-talents': require('./linkedin.talents.browser.scraper'),
};

async function runBrowserScraper(name, options = {}) {
  const scraper = browserScrapers[name];
  if (!scraper) {
    throw new Error(`Browser scraper not found: ${name}`);
  }
  logger.info('Running browser scraper', { name, options });
  return scraper(options);
}

module.exports = {
  runBrowserScraper,
};
