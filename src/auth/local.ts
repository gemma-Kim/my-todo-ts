import * as bcrypt from 'bcrypt';
import * as passport from 'passport'
import prisma, { userModel } from '../models';
import { Strategy } from "passport-local"

export default () => {
  passport.use(new Strategy({ 
    session: true,
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await userModel.findUniqueUser({ email: email })
      
      if (user) {
        const { password: hashedPW } = user
        await bcrypt.compare(password, hashedPW, (err, result) => {
          if (err) {
            console.error(err)
            return done(null, false)
          }
          if (!result) {
            return done(null, false, { message: "비밀번호가 잘못되었습니다." })
          } else {
            return done(null, user)
          }
        })
      } else {
        return done(null, false, { message: "존재하지 않는 사용자입니다." })
      }
            
      
    } catch (err) {
      done(err)
    }
  })
  )
}