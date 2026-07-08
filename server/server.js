require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection:`, err);
  server.close(() => process.exit(1));
});

process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});
