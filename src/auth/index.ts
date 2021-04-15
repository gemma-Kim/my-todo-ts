import * as passport from 'passport';
import prisma from '../models';
import local from './local'

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);      
  });

  passport.deserializeUser( async (id: number, done) => {
    try {
      const user = await prisma.users.findUnique({
        where: { 
          id 
        },
        select: {
          id: true
        }
      })
      done(null, user);
    } catch (err) {
      console.error(err)
      done(err)
    }
  });
  local();
}
