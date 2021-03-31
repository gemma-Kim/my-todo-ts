import * as bcrypt from 'bcrypt';
import * as passport from 'passport'
import prisma from '../models';
import { Strategy } from "passport-local"

export default () => {
  passport.use( new Strategy({ 
    usernameField: 'email',
    passwordField: 'inputPW',
    session: true,
  }, async (email, inputPW, done) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        }
      })

      if (!user) return done(null, false, { message: "invalid user" })

      const { id, password: hashedPW } = user
      await bcrypt.compare(inputPW, hashedPW, (err, result) => {
        if (!result) return done(null, false, { message: "wrong password" })
        return done(null, user)
      })

    } catch (err) {
      done(err)
    }
  })
  )
}
