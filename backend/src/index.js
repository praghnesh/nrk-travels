const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

let server;

// Connect to MongoDB, then start the server
connectDB().then(() => {
  server = app.listen(config.port, () => {
    console.log(`======================================`);
    console.log(` Vizag Taxi Backend Server Started `);
    console.log(` Port: ${config.port} | Mode: ${config.env} `);
    console.log(`======================================`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error('Unexpected Error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
