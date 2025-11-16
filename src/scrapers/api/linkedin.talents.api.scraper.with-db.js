import axios from 'axios';
import logger from '../../utils/logger.js';
import { insert, insertMany } from '../../utils/database.js';

// Ejemplo de scraper API que guarda en MySQL
export default async function linkedinTalentsApiScraperWithDB(options = {}) {
  const url = 'https://jsonplaceholder.typicode.com/users'; // API de ejemplo
  logger.info('Calling talents API', { url });

  const startTime = Date.now();
  let status = 'success';
  let errorMessage = null;

  try {
    const response = await axios.get(url);
    const data = response.data;

    logger.info('API data received', { count: Array.isArray(data) ? data.length : 1 });

    // Guardar en tabla scraped_data (registro general)
    await insert('scraped_data', {
      scraper_name: 'linkedin-talents',
      scraper_type: 'api',
      data: JSON.stringify(data),
    });

    // Guardar en tabla específica linkedin_talents
    const talents = data.map((user) => ({
      name: user.name,
      email: user.email,
      company: user.company?.name || null,
      position: null,
      raw_data: JSON.stringify(user),
    }));

    await insertMany('linkedin_talents', talents);

    logger.info('Data saved to MySQL', { count: talents.length });

    return data;
  } catch (error) {
    status = 'error';
    errorMessage = error.message;
    throw error;
  } finally {
    // Guardar log de ejecución
    const executionTime = Date.now() - startTime;
    await insert('scraper_logs', {
      scraper_name: 'linkedin-talents',
      scraper_type: 'api',
      status,
      records_count: status === 'success' ? data?.length || 0 : 0,
      error_message: errorMessage,
      execution_time_ms: executionTime,
    }).catch((err) => {
      logger.error('Failed to save scraper log', { error: err.message });
    });
  }
}
