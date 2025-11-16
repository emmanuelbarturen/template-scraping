// Configuración de la base de datos MySQL
export default {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'beneficios_scraper',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
