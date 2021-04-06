import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as expressSession from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import passportSetting from './auth';
import router from './routes';
import { prod } from './server';

dotenv.config();
const app = express();

// basic middlewear
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET!,
  cookie: {
    httpOnly: true,
    secure: false
  },
}));

app.use(passport.initialize());
app.use(passport.session());
passportSetting();

app.use(router);
app.use(cors);

// additional middelewear
if (prod) {
  app.use(logger('combined'));

} else {
  app.use(logger('dev'))
}

export default app;
