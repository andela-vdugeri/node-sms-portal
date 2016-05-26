'use strict';

var development = {
  database: {
    url: 'postgres://postgres:password@localhost:5432/sms_portal',
    port: '5432',
    host: 'localhost'
  },
  token: {
    secret: 'someRandomString'
  },

  auth: {
    authUrl: '/api/v1/auth/login'
  },

  infobip: {
    sms: {
      endPoint: '/sms/1/text/single'
    },
    host: 'https://api.infobip.com',
    username: 'danverem',
    password: 'leo72561899'
  },
  nexmo: {
    HOST: 'https://rest.nexmo.com',
    API_KEY: '0943f9c8',
    API_SECRET: 'b93ad7e137be87a3',
    PORT: 443,
    sms: {
      endPoint: '/sms/json'
    }
  }
};

var production = {
  database: {
    url: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST
  },
  token: {
    secret: 'someRandomString'
  },
  sms: {
    endPoint: '/sms/1/text/single'
  },
  infobip: {
    host: 'api.infobip.com',
    username: 'arize',
    password: 'Pass04'
  },
  auth: {
    authUrl: process.env.AUTH_URL
  }
};

var test = {
  database: {
    url: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/sms_portal_test',
    port: process.env.DATABASE_PORT || '5432',
    host: process.env.DATABASE_HOST || 'localhost'
  },
  token: {
    secret: 'someRandomString'
  },
  sms: {
    endPoint: '/sms/1/text/single'
  },
  infobip: {
    host: 'api.infobip.com',
    username: 'arize',
    password: 'Pass04'
  },
  auth: {
    authUrl: process.env.AUTH_URL
  }
};


var config = {
  development: development,
  production: production,
  test: test
};

module.exports = config;
