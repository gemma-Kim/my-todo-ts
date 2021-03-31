import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as expressSession from 'express-session'
import * as cookieParser from 'cookie-parser'
import * as passport from 'passport';
import passportConfig from './passport';
import { prod } from './server';
import router from './routes';

dotenv.config();
const app = express();

// basic middlewear
//express.static('uploads')
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
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
passportConfig();

app.use(router);
app.use(cors);
// middelewear
if (prod) {
  app.use(morgan('combined'));

} else {
  app.use(morgan('dev'))
}

export default app;