import * as passport from 'passport';
import prisma from '../models';
import local from './local'

export default () => {
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await prisma.users.findUnique({
        where: { id }
      })
      if (!user) {
        return done(new Error('no user'));
      }
      return done(null, user);
    } catch (err) {
      console.error(err)
      return done(err)
    }
  });

  local();
}