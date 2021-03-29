import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as expressSession from 'express-session'
import * as cookieParser from 'cookie-parser'
import * as passport from 'passport';
import { prod } from './server';

dotenv.config();
const app = express();

// middelewear
if (prod) {
  app.use(morgan('combined'));

} else {
  app.use(morgan('dev'))
}

// basic middlewear
//express.static('uploads')
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET!,
  cookie: {
    httpOnly: true,
    secure: false,
    domain: undefined,
  },
}));

export default app;