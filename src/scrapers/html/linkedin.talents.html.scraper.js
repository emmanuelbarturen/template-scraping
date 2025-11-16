const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../../utils/logger');

module.exports = async function linkedinTalentsHtmlScraper(options = {}) {
  const url = 'https://example.com'; // página de ejemplo
  logger.info('Fetching HTML page', { url });

  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Ejemplo: extraer el título de la página
  const title = $('title').text().trim();
  const headings = [];
  
  $('h1, h2').each((_, el) => {
    headings.push($(el).text().trim());
  });

  logger.info('HTML data extracted', { title, headingsCount: headings.length });

  return { title, headings };
};
