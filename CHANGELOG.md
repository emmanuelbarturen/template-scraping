# Changelog

## [1.1.0] - Soporte MySQL

### Agregado
- ✅ Soporte completo para MySQL con `mysql2`
- ✅ Pool de conexiones configurable
- ✅ Módulo `src/utils/database.js` con funciones CRUD:
  - `insert()` - Insertar un registro
  - `insertMany()` - Insertar múltiples registros
  - `update()` - Actualizar registros
  - `find()` - Buscar registros
  - `query()` - Ejecutar queries personalizados
- ✅ Script de inicialización `src/utils/db-init.sql` con 3 tablas:
  - `scraped_data` - Datos generales scrapeados
  - `linkedin_talents` - Talentos de LinkedIn
  - `scraper_logs` - Logs de ejecución
- ✅ Configuración de base de datos en `src/config/database.js`
- ✅ Variables de entorno para MySQL en `.env.example`
- ✅ Ejemplo de scraper con MySQL: `linkedin.talents.api.scraper.with-db.js`
- ✅ Documentación completa en `MYSQL_SETUP.md`
- ✅ Inicialización automática del pool al arrancar el servidor
- ✅ Cierre correcto de conexiones al terminar (SIGTERM/SIGINT)

### Características
- El sistema funciona con o sin MySQL (opcional)
- Si MySQL no está disponible, el servidor continúa funcionando normalmente
- Pool de conexiones reutilizables para mejor rendimiento
- Manejo de errores robusto en todas las operaciones de DB

## [1.0.0] - Release Inicial

### Agregado
- ✅ Servidor HTTP con Express
- ✅ Soporte para 3 tipos de scrapers: API, HTML (Cheerio), Browser (Puppeteer)
- ✅ Sistema de scheduling interno con node-cron
- ✅ Configuración de jobs programados en `jobs.config.js`
- ✅ Endpoints HTTP para ejecutar scrapers bajo demanda
- ✅ Logger centralizado
- ✅ Arquitectura modular y extensible
- ✅ Soporte para PM2
- ✅ ES Modules (import/export)
- ✅ Documentación completa
