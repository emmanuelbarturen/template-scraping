# Beneficios Scraper - Template

Template base para extracción de datos con 3 estrategias diferentes:
- **API**: Consumo directo de APIs REST
- **HTML/Cheerio**: Extracción de HTML estático
- **Browser/Puppeteer**: Simulación de navegación para sitios dinámicos

## Instalación

```bash
npm install
```

## Estructura del proyecto

```
src/
├── config/           # Configuración general
├── utils/            # Utilidades (logger, etc.)
├── scrapers/
│   ├── api/         # Scrapers que consumen APIs
│   ├── html/        # Scrapers con Cheerio (HTML estático)
│   └── browser/     # Scrapers con Puppeteer (navegación)
└── schedulers/      # Puntos de entrada para cron jobs
```

## Uso

### Ejecución manual

Cada tipo de scraper se ejecuta con variables de entorno:

**Scraper por API:**
```bash
SCRAPER_TYPE=api SCRAPER_NAME=linkedin-talents node app.js
# o usando npm script:
npm run scrape:api
```

**Scraper por HTML/Cheerio:**
```bash
SCRAPER_TYPE=html SCRAPER_NAME=linkedin-talents node app.js
# o usando npm script:
npm run scrape:html
```

**Scraper por Browser/Puppeteer:**
```bash
SCRAPER_TYPE=browser SCRAPER_NAME=linkedin-talents node app.js
# o usando npm script:
npm run scrape:browser
```

### Configuración con Cron

Para ejecutar scrapers automáticamente, agrega entradas a tu crontab:

```bash
# Ejecutar scraper API cada día a las 2am
0 2 * * * cd /ruta/al/proyecto && SCRAPER_TYPE=api SCRAPER_NAME=linkedin-talents node app.js >> logs/api.log 2>&1

# Ejecutar scraper HTML cada hora
0 * * * * cd /ruta/al/proyecto && SCRAPER_TYPE=html SCRAPER_NAME=linkedin-talents node app.js >> logs/html.log 2>&1

# Ejecutar scraper Browser cada 6 horas
0 */6 * * * cd /ruta/al/proyecto && SCRAPER_TYPE=browser SCRAPER_NAME=linkedin-talents node app.js >> logs/browser.log 2>&1
```

## Agregar nuevos scrapers

### 1. Crear el archivo del scraper

**Para API** (`src/scrapers/api/mi-scraper.api.scraper.js`):
```javascript
const axios = require('axios');
const logger = require('../../utils/logger');

module.exports = async function miScraperApi(options = {}) {
  const url = 'https://api.example.com/data';
  logger.info('Calling API', { url });
  
  const response = await axios.get(url);
  logger.info('Data received', { count: response.data.length });
  
  return response.data;
};
```

**Para HTML/Cheerio** (`src/scrapers/html/mi-scraper.html.scraper.js`):
```javascript
const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../../utils/logger');

module.exports = async function miScraperHtml(options = {}) {
  const url = 'https://example.com/page';
  logger.info('Fetching HTML', { url });
  
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const data = [];
  $('.item').each((_, el) => {
    data.push($(el).text().trim());
  });
  
  logger.info('Data extracted', { count: data.length });
  return data;
};
```

**Para Browser/Puppeteer** (`src/scrapers/browser/mi-scraper.browser.scraper.js`):
```javascript
const puppeteer = require('puppeteer');
const logger = require('../../utils/logger');

module.exports = async function miScraperBrowser(options = {}) {
  const url = 'https://example.com/page';
  logger.info('Launching browser', { url });
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  const data = await page.$$eval('.item', (nodes) =>
    nodes.map((n) => n.textContent.trim())
  );
  
  await browser.close();
  logger.info('Data extracted', { count: data.length });
  
  return data;
};
```

### 2. Registrar el scraper

Edita el archivo `index.js` correspondiente y agrega tu scraper al objeto de registro:

**`src/scrapers/api/index.js`:**
```javascript
const apiScrapers = {
  'linkedin-talents': require('./linkedin.talents.api.scraper'),
  'mi-scraper': require('./mi-scraper.api.scraper'), // ← agregar aquí
};
```

### 3. Ejecutar

```bash
SCRAPER_TYPE=api SCRAPER_NAME=mi-scraper node app.js
```

## Ejemplos incluidos

El template incluye un scraper de ejemplo llamado `linkedin-talents` implementado en los 3 tipos:
- **API**: Consume JSONPlaceholder (API pública de prueba)
- **HTML**: Extrae título y encabezados de example.com
- **Browser**: Navega a example.com y extrae título y encabezados con Puppeteer

Estos ejemplos son solo para demostración. Reemplázalos con tus scrapers reales.
