import axios from 'axios';
import logger from '../../utils/logger.js';

export default async function linkedinTalentsApiScraper(options = {}) {
  const url = 'https://jsonplaceholder.typicode.com/users'; // API de ejemplo
  logger.info('Calling talents API', { url });

  const response = await axios.get(url);
  const data = response.data;

  // Aquí podrías guardar en DB, archivo, etc.
  logger.info('API data received', { count: Array.isArray(data) ? data.length : 1 });

  return data;
}
