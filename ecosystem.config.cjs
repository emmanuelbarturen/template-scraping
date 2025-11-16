module.exports = {
    apps: Array.from({ length: 2 }, (_, index) => ({
        name: 'Scrapping',
        max_memory_restart: '750M',
        autorestart: true,
        instances: '1',
        exec_mode: 'fork',
        watch: false,
        max_restarts: 10,
        restart_delay: 5000,
        kill_timeout: 3000,
        min_uptime: 1000,
        script: 'npm',
        args: 'start',
        cwd: '/app',
        pid_file: `./logs/service_scrapping.pid`,
        out_file: `./logs/service_scrapping.log`,
        error_file: `./logs/service_scrapping.err`,
        env: {
            NODE_ENV: 'testing',
            PORT: 3000 + index,
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3000 + index,
        },
    })),
}