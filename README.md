# Beneficios Scraper - Template

Template base para extracción de datos con 3 estrategias diferentes:
- **API**: Consumo directo de APIs REST
- **HTML/Cheerio**: Extracción de HTML estático
- **Browser/Puppeteer**: Simulación de navegación para sitios dinámicos

Servidor HTTP persistente con scheduler interno, diseñado para ejecutarse con PM2.

## Instalación

```bash
npm install
```

### Configuración de MySQL (Opcional)

Si deseas guardar datos en MySQL:

1. Instala MySQL en tu sistema
2. Ejecuta el script de inicialización: `mysql -u root -p < src/utils/db-init.sql`
3. Copia `.env.example` a `.env` y configura las credenciales de MySQL
4. Ver guía completa en: [MYSQL_SETUP.md](MYSQL_SETUP.md)

El sistema funciona sin MySQL, pero no guardará datos en base de datos.

## Estructura del proyecto

```
src/
├── config/
│   ├── index.js           # Configuración general
│   ├── database.js        # Configuración de MySQL
│   └── jobs.config.js     # Configuración de jobs programados
├── utils/
│   ├── logger.js          # Logger centralizado
│   ├── scheduler.js       # Sistema de scheduling
│   ├── database.js        # Funciones de base de datos MySQL
│   └── db-init.sql        # Script de inicialización de DB
├── scrapers/
│   ├── api/              # Scrapers que consumen APIs
│   ├── html/             # Scrapers con Cheerio (HTML estático)
│   └── browser/          # Scrapers con Puppeteer (navegación)
└── schedulers/           # (Deprecated) Usar jobs.config.js
```

## Uso

### Iniciar el servidor

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

**Con PM2:**
```bash
pm2 start ecosystem.config.cjs
pm2 logs
pm2 status
```

### Ejecutar scrapers manualmente vía HTTP

Una vez que el servidor está corriendo, puedes ejecutar scrapers bajo demanda:

```bash
# Health check
curl http://localhost:3000/health

# Ejecutar scraper API
curl -X POST http://localhost:3000/scraper/run \
  -H "Content-Type: application/json" \
  -d '{
    "type": "api",
    "name": "linkedin-talents",
    "options": {}
  }'

# Ejecutar scraper HTML
curl -X POST http://localhost:3000/scraper/run \
  -H "Content-Type: application/json" \
  -d '{
    "type": "html",
    "name": "linkedin-talents"
  }'

# Ejecutar scraper Browser
curl -X POST http://localhost:3000/scraper/run \
  -H "Content-Type: application/json" \
  -d '{
    "type": "browser",
    "name": "linkedin-talents"
  }'
```

### Configurar tareas programadas (Cron Jobs)

Edita `src/config/jobs.config.js` para agregar jobs programados:

```javascript
export default [
  {
    name: 'linkedin-talents-api-daily',
    schedule: '0 2 * * *',        // Cada día a las 2am
    type: 'api',
    scraper: 'linkedin-talents',
    enabled: true,                 // Cambiar a true para activar
    options: {},
  },
  {
    name: 'linkedin-talents-html-hourly',
    schedule: '0 * * * *',         // Cada hora
    type: 'html',
    scraper: 'linkedin-talents',
    enabled: true,
    options: {},
  },
];
```

Los jobs se cargan automáticamente al iniciar el servidor.

## Agregar nuevos scrapers

### 1. Crear el archivo del scraper

**Para API** (`src/scrapers/api/mi-scraper.api.scraper.js`):
```javascript
import axios from 'axios';
import logger from '../../utils/logger.js';
import { insert, insertMany } from '../../utils/database.js';

export default async function miScraperApi(options = {}) {
  const url = 'https://api.example.com/data';
  logger.info('Calling API', { url });
  
  const response = await axios.get(url);
  const data = response.data;
  
  // Guardar en MySQL (opcional)
  await insert('scraped_data', {
    scraper_name: 'mi-scraper',
    scraper_type: 'api',
    data: JSON.stringify(data),
  });
  
  logger.info('Data received and saved', { count: data.length });
  
  return data;
}
```

**Para HTML/Cheerio** (`src/scrapers/html/mi-scraper.html.scraper.js`):
```javascript
import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../../utils/logger.js';

export default async function miScraperHtml(options = {}) {
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
}
```

**Para Browser/Puppeteer** (`src/scrapers/browser/mi-scraper.browser.scraper.js`):
```javascript
import puppeteer from 'puppeteer';
import logger from '../../utils/logger.js';

export default async function miScraperBrowser(options = {}) {
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
}
```

### 2. Registrar el scraper

Edita el archivo `index.js` correspondiente y agrega tu scraper al objeto de registro:

**`src/scrapers/api/index.js`:**
```javascript
import miScraperApi from './mi-scraper.api.scraper.js';

const apiScrapers = {
  'linkedin-talents': linkedinTalentsApiScraper,
  'mi-scraper': miScraperApi, // ← agregar aquí
};
```

### 3. Ejecutar

**Vía HTTP:**
```bash
curl -X POST http://localhost:3000/scraper/run \
  -H "Content-Type: application/json" \
  -d '{"type": "api", "name": "mi-scraper"}'
```

**O agregar a jobs programados en `src/config/jobs.config.js`:**
```javascript
{
  name: 'mi-scraper-daily',
  schedule: '0 3 * * *',
  type: 'api',
  scraper: 'mi-scraper',
  enabled: true,
  options: {},
}
```

## Ejemplos incluidos

El template incluye un scraper de ejemplo llamado `linkedin-talents` implementado en los 3 tipos:
- **API**: Consume JSONPlaceholder (API pública de prueba)
- **HTML**: Extrae título y encabezados de example.com
- **Browser**: Navega a example.com y extrae título y encabezados con Puppeteer

Estos ejemplos son solo para demostración. Reemplázalos con tus scrapers reales.
