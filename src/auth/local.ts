import * as bcrypt from 'bcrypt';
import * as passport from 'passport'
import prisma from '../models';
import { Strategy } from "passport-local"

export default () => {
  passport.use(new Strategy({ 
    session: true,
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        }
      })
      
      if (!user) return done(null, false, { message: "invalid user" })

      const { password: hashedPW } = user
      
      await bcrypt.compare(password, hashedPW, (err, result) => {
        if (err) {
          console.error(err)
          return done(null, false, { message: "error"})
        }
        if (!result) return done(null, false, { message: "wrong password" })
        return done(null, user)
      })      
      
    } catch (err) {
      done(err)
    }
  })
  )
}