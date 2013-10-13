var state = 'dev';

config = {};

config.dev = {
  PORT: '8888',
  IP: '127.0.0.1',
  MONGO_URL: 'mongodb://localhost/metroly'
};

config.prod = {
  PORT: process.env.OPENSHIFT_NODEJS_PORT,
  IP: process.env.OPENSHIFT_NODEJS_IP,
  MONGO_URL: 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/'
};

module.exports = (state === 'prod') ? config.prod : config.dev;