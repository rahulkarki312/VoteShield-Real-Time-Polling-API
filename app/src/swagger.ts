const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'High Performance Polls API',
        description: 'API for managing high-performance polls',
        version: '1.0.0'
    },
    host: 'localhost:3001',
    
    schemes: ['http'],
};

const outputFile = '../swagger-output.json';
const endpointsFiles = ['./index.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);