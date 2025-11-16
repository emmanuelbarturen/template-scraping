# Guía Rápida - Beneficios Scraper

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor

**Desarrollo (con auto-reload):**
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
pm2 logs Scrapping
```

### 3. Verificar que está corriendo
```bash
curl http://localhost:3000/health
```

## 📋 Ejecutar Scrapers

### Vía HTTP (manual)

```bash
# Scraper API
curl -X POST http://localhost:3000/scraper/run \
  -H "Content-Type: application/json" \
  -d '{"type": "api", "name": "linkedin-talents"}'

# Scraper HTML
curl -X POST http://localhost:3000/scraper/run \
  -H "Content-Type: application/json" \
  -d '{"type": "html", "name": "linkedin-talents"}'

# Scraper Browser
curl -X POST http://localhost:3000/scraper/run \
  -H "Content-Type: application/json" \
  -d '{"type": "browser", "name": "linkedin-talents"}'
```

### Vía Jobs Programados

Edita `src/config/jobs.config.js` y cambia `enabled: true`:

```javascript
export default [
  {
    name: 'linkedin-talents-api-daily',
    schedule: '0 2 * * *',  // 2am cada día
    type: 'api',
    scraper: 'linkedin-talents',
    enabled: true,  // ← Activar aquí
    options: {},
  },
];
```

Reinicia el servidor para aplicar cambios.

## 📁 Estructura Clave

```
app.js                          # ← Punto de entrada único (servidor HTTP)
src/
├── config/
│   └── jobs.config.js         # ← Configurar jobs programados aquí
├── scrapers/
│   ├── api/                   # ← Agregar scrapers de API aquí
│   ├── html/                  # ← Agregar scrapers de HTML aquí
│   └── browser/               # ← Agregar scrapers de Puppeteer aquí
└── utils/
    └── scheduler.js           # Sistema de scheduling interno
```

## ➕ Agregar Nuevo Scraper

1. **Crear archivo del scraper** en la carpeta correspondiente:
   - API: `src/scrapers/api/mi-scraper.api.scraper.js`
   - HTML: `src/scrapers/html/mi-scraper.html.scraper.js`
   - Browser: `src/scrapers/browser/mi-scraper.browser.scraper.js`

2. **Registrarlo** en el `index.js` de su carpeta:
   ```javascript
   import miScraper from './mi-scraper.api.scraper.js';
   
   const apiScrapers = {
     'linkedin-talents': linkedinTalentsApiScraper,
     'mi-scraper': miScraper,  // ← agregar aquí
   };
   ```

3. **Ejecutarlo** vía HTTP o agregarlo a `jobs.config.js`

## 🔧 PM2 Comandos Útiles

```bash
# Iniciar
pm2 start ecosystem.config.cjs

# Ver logs en tiempo real
pm2 logs Scrapping

# Ver estado
pm2 status

# Reiniciar
pm2 restart Scrapping

# Detener
pm2 stop Scrapping

# Eliminar
pm2 delete Scrapping
```

## 🌐 Endpoints Disponibles

- `GET /health` - Health check
- `POST /scraper/run` - Ejecutar scraper manualmente
  - Body: `{ "type": "api|html|browser", "name": "scraper-name", "options": {} }`

## 📝 Formato de Cron

```
┌───────────── minuto (0 - 59)
│ ┌───────────── hora (0 - 23)
│ │ ┌───────────── día del mes (1 - 31)
│ │ │ ┌───────────── mes (1 - 12)
│ │ │ │ ┌───────────── día de la semana (0 - 6) (Domingo = 0)
│ │ │ │ │
* * * * *
```

Ejemplos:
- `0 2 * * *` - Cada día a las 2:00 AM
- `0 */6 * * *` - Cada 6 horas
- `*/30 * * * *` - Cada 30 minutos
- `0 0 * * 1` - Cada lunes a medianoche
