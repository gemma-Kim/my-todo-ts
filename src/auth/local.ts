import prisma from '../models';
import * as passport from 'passport'
import { Strategy } from "passport-local";

export default () => {
  passport.use('local',
    new Strategy({ session: true }, (email, password, done) => {
      try {
        const user = prisma.users.findUnique({
          where: {
            email: email,
          }
        })
        if (!user) return done(null, false, { message: "invalid user" })
        //비밀번호 매칭 확인
        done(null, user)
      } catch (err) {
        done(err)
      }
    })
  )
}
