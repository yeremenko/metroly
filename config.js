var state = 'prod';

config = {};

config.dev = {
  PORT: '8888',
  IP: '127.0.0.1',
  MONGO_URL: 'mongodb://localhost/metroly'
};

config.prod = {
  PORT: process.env.OPENSHIFT_NODEJS_PORT,
  IP: process.env.OPENSHIFT_NODEJS_IP,
  MONGO_URL: process.env.OPENSHIFT_MONGODB_DB_URL
};

module.exports = (state === 'prod') ? config.prod : config.dev;