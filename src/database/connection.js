const mongoose = require('mongoose');

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT? `:${process.env.DB_PORT}` : '';
const dbName = process.env.DB_NAME;
const dbDriver = process.env.DB_DRIVER;

const dbUrl = `${dbDriver}://${dbUser}:${dbPass}@${dbHost}${dbPort}/${dbName}`;

const connet = async () => {
  try {
    await mongoose.connect(dbUrl, {
      authSource: "admin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority"
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(`MongoDB connection error: ${dbUrl} \n ${err}`);
  }
};

module.exports = connet;