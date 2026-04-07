module.exports = {
  apps: [
    {
      name: 'funtern-backend',
      script: './src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '512M',
    },
  ],
};
