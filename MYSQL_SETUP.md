# Configuración de MySQL

## 1. Instalar MySQL

### macOS (con Homebrew)
```bash
brew install mysql
brew services start mysql
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### Windows
Descargar e instalar desde: https://dev.mysql.com/downloads/installer/

## 2. Crear la base de datos

```bash
# Conectar a MySQL
mysql -u root -p

# O sin contraseña si es instalación nueva
mysql -u root
```

Ejecutar el script de inicialización:

```bash
mysql -u root -p < src/utils/db-init.sql
```

O manualmente desde el cliente MySQL:

```sql
SOURCE /ruta/completa/al/proyecto/src/utils/db-init.sql;
```

## 3. Configurar variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=beneficios_scraper
```

## 4. Verificar conexión

Inicia el servidor y verifica los logs:

```bash
npm start
```

Deberías ver en los logs:
```
[INFO] MySQL connection pool created {"host":"localhost","database":"beneficios_scraper"}
```

## 5. Tablas creadas

El script `db-init.sql` crea las siguientes tablas:

### `scraped_data`
Tabla general para almacenar cualquier dato scrapeado en formato JSON.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID auto-incremental |
| scraper_name | VARCHAR(100) | Nombre del scraper |
| scraper_type | ENUM | Tipo: api, html, browser |
| data | JSON | Datos scrapeados en formato JSON |
| created_at | TIMESTAMP | Fecha de creación |

### `linkedin_talents`
Tabla específica para talentos de LinkedIn.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID auto-incremental |
| name | VARCHAR(255) | Nombre del talento |
| email | VARCHAR(255) | Email (único) |
| company | VARCHAR(255) | Empresa |
| position | VARCHAR(255) | Posición |
| raw_data | JSON | Datos completos en JSON |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### `scraper_logs`
Tabla de logs de ejecución de scrapers.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID auto-incremental |
| scraper_name | VARCHAR(100) | Nombre del scraper |
| scraper_type | ENUM | Tipo: api, html, browser |
| status | ENUM | Estado: success, error |
| records_count | INT | Cantidad de registros procesados |
| error_message | TEXT | Mensaje de error (si aplica) |
| execution_time_ms | INT | Tiempo de ejecución en ms |
| created_at | TIMESTAMP | Fecha de ejecución |

## 6. Uso en scrapers

### Importar funciones de base de datos

```javascript
import { insert, insertMany, update, find, query } from '../../utils/database.js';
```

### Insertar un registro

```javascript
const id = await insert('scraped_data', {
  scraper_name: 'mi-scraper',
  scraper_type: 'api',
  data: JSON.stringify(misDatos),
});
```

### Insertar múltiples registros

```javascript
const ids = await insertMany('linkedin_talents', [
  { name: 'Juan', email: 'juan@example.com', company: 'Acme' },
  { name: 'María', email: 'maria@example.com', company: 'Tech Co' },
]);
```

### Actualizar registros

```javascript
await update(
  'linkedin_talents',
  { company: 'Nueva Empresa' },
  { email: 'juan@example.com' }
);
```

### Buscar registros

```javascript
const talents = await find('linkedin_talents', 
  { company: 'Acme' },
  { orderBy: 'created_at DESC', limit: 10 }
);
```

### Query personalizado

```javascript
const results = await query(
  'SELECT * FROM linkedin_talents WHERE created_at > ?',
  ['2024-01-01']
);
```

## 7. Ejemplo completo

Ver archivo: `src/scrapers/api/linkedin.talents.api.scraper.with-db.js`

Este ejemplo muestra cómo:
- Obtener datos de una API
- Guardar en tabla general `scraped_data`
- Guardar en tabla específica `linkedin_talents`
- Registrar logs de ejecución en `scraper_logs`

## 8. Troubleshooting

### Error: "Access denied for user"
Verifica las credenciales en `.env` y que el usuario tenga permisos.

### Error: "Unknown database"
Ejecuta el script `db-init.sql` para crear la base de datos.

### Error: "Table doesn't exist"
Ejecuta el script `db-init.sql` para crear las tablas.

### Conexión lenta
Ajusta `connectionLimit` en `src/config/database.js`.
