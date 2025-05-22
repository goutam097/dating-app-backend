const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const userRouter = require('./routes/v1/user.router');
const { errorConverter, errorHandler } = require('./middlewares/error');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const basicAuth = require('express-basic-auth');

const { createNamespace } = require('cls-hooked');

const namespace = createNamespace('app');

const app = express();

/**************** Swagger Definition ***************/
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dating App API',
      version: '1.0.0',
      description: 'Dating App API documentation',
      contact: {
        email: 'goutamsingh69@gmail.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    components: {
      securitySchemes: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'This url is for local server',
      },
    ],
  },
  apis: [
    'src/routes/v1/user/*.js',
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());

app.use(express.json({ limit: '700mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '500mb',
    parameterLimit: 1000000000000,
  })
);

app.use((req, res, next) => {
  namespace.run(() => {
    namespace.set('requestUrl', req.protocol + '://' + req.get('host') + req.originalUrl);
    next();
  });
});

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Swagger Api.
app.use(
  '/api-docs',
  basicAuth({ users: { [process.env.USERNAMESUI]: process.env.PASSWORDSUI }, challenge: true }),
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs)
);

// v1 api routes
app.use('/api/v1', userRouter);

app.use('/', function (req, res) {
  res.status(200).json({
    statusCode: 200,
    message: 'Blank URL',
  });
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  // next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
module.exports = app;
