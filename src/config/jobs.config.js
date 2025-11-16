// Configuración de jobs programados (cron)
// Formato cron: segundo minuto hora día mes día-semana
// Ejemplos:
//   '0 2 * * *'     - Cada día a las 2:00 AM
//   '0 */6 * * *'   - Cada 6 horas
//   '*/30 * * * *'  - Cada 30 minutos
//   '0 0 * * 1'     - Cada lunes a medianoche

export default [
  // Ejemplo: Scraper API cada día a las 2am
  // {
  //   name: 'linkedin-talents-api-daily',
  //   schedule: '0 2 * * *',
  //   type: 'api',
  //   scraper: 'linkedin-talents',
  //   enabled: false,
  //   options: {},
  // },

  // Ejemplo: Scraper HTML cada hora
  // {
  //   name: 'linkedin-talents-html-hourly',
  //   schedule: '0 * * * *',
  //   type: 'html',
  //   scraper: 'linkedin-talents',
  //   enabled: false,
  //   options: {},
  // },

  // Ejemplo: Scraper Browser cada 6 horas
  // {
  //   name: 'linkedin-talents-browser-6h',
  //   schedule: '0 */6 * * *',
  //   type: 'browser',
  //   scraper: 'linkedin-talents',
  //   enabled: false,
  //   options: {},
  // },
];
