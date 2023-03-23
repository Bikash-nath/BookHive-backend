const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  if (process.env.NODE_ENV === 'development') {
    console.log(err.name, err.message, err.stack);
  }
  process.exit(1);
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// const DB = process.env.DATABASE_LOCAL;

const connectDB = async () => {
  try {
    mongoose.connect(DB).then((conn) => console.log('MongoDB Connected:', conn.connection.host));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const port = process.env.PORT || 3000;
var server;

connectDB().then(
  () =>
    (server = app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    }))
);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
