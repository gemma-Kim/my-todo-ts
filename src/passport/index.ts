import * as passport from 'passport';
import prisma from '../models';
import local from './local'

export default () => {
  passport.serializeUser((user, done) => {
    console.log('와아')
    return done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log('하하')
      const user = await prisma.users.findUnique({
        where: { id }
      })
      return done(null, user);
    } catch (err) {
      console.error(err)
      return done(err)
    }
  });
  local();
}