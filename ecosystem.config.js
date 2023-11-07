module.exports = {
  apps: [
    {
      name: 'mcit-server',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
