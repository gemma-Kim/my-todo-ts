import * as express from 'express'
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'
import * as expressSession from 'express-session'
import * as cors from 'cors'
import * as morgan from 'morgan'
import * as passport from 'passport'
import * as swaggerJsDoc from 'swagger-jsdoc'
import * as swaggerUi from 'swagger-ui-express'
import passportSetting from './auth';
import { userRouter, todoRouter } from './routes'

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// session middleware
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }));
app.use(passport.initialize());
app.use(passport.session());
passportSetting();

// swagger options
const swggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      components: {},
      info: {
          title: 'My todo API',
          version: '1.0.0',
      },
    },
    apis: ['./src/routes/user.ts', './src/routes/todo.ts'],
}

const swaggerDocs = swaggerJsDoc(swggerOptions)
console.log(swaggerDocs)

// routers
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/user', userRouter)
app.use('/todo', todoRouter)

// not found (404) error handler
app.use((req, res, next) => {
  return res.status(404).send('Sorry cant find that!');
});

app.use(cors);

export default app
