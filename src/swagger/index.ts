import * as swaggerUi from 'swagger-ui-express';
import * as swaggereJsdoc from 'swagger-jsdoc';
import * as express from 'express';
import * as path from 'path'

const router = express.Router();

const options = {
    swaggerDefinition: {
        info: {
            title: 'My Todo API',
            version: '1.0.0',
            description: ' API',
        },
        host: 'localhost:3065',
        basePath: '/'
    },
    apis: [path.join(__dirname + '../dist/*.js')]
};

export default {
    options
}