import app from '../app';
import prisma from '../models'
import * as request from 'supertest';

describe('Success User API', () => {
  let cookies: string;
  const userData = {
    'email': 'testsignup@test.com',
    'password': '12345678'
  }

  after(async () => {
    await prisma.$queryRaw('DELETE FROM users ORDER BY id DESC LIMIT 1;')
  })
  
  it('POST signup', (done) => {
    request(app)
      .post('/users/signup')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      })
  })

  // 로그인 실패사례 추가: 이메일, 패스워드

  it('POST login', (done) => {
    request(app)
      .post('/users/login')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          cookies = res.headers["set-cookie"].pop().split(";")[0];
          done();
        }
      })
  })

  it('POST logout', (done) => {
    request(app)
      .post('/users/logout')
      .set('Cookie', [cookies])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done();
        }
      })
  })

})
