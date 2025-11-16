// Simple logger utility (can be replaced by a real logger later)
function log(level, message, meta = {}) {
  const payload = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${payload}`);
}

export default {
  info: (msg, meta) => log('info', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
};
