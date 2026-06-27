const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'High Performance Polls API',
    description: 'Redis Real Time Polls',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = '../swagger-output.json';
const endpointsFiles = ['./index.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);