import app from '../app';
import prisma from '../models';
import * as request from 'supertest';
import { expect } from 'chai';

describe('사용자 인증', function () {
  let cookies: string;
  let user_id: number;
  const userData = {
    'email': 'testsignup1@test.com',
    'password': '12345678'
  }
  const doesntExistUser = {
    'email': 'wronguser@test.com',
    'password': '12345678'
  }
  const wrongpwUser = {
    'email': 'testsignup1@test.com',
    'password': "123456789"
  }
  
  it('회원가입 성공', done => {
    request(app)
      .post('/user/signup')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          user_id = res.body.user_id
          done();
        }
      })
  })
  it('존재하지 않는 사용자의 로그인', done => {
    request(app)
      .post('/user/login')
      .send(doesntExistUser)
      .expect(401)
      .then(res => {
        expect(res.body).to.equal('존재하지 않는 사용자입니다.')
        done()
      })
      .catch (err => {
      done(err)
    })
  })
  it('비밀번호가 잘못된 로그인', done => {
    request(app)
      .post('/user/login')
      .send(wrongpwUser)
      .expect(401)
      .then(res => {
        expect(res.body).to.equal('비밀번호가 잘못되었습니다.')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('로그인 성공', done => {
    request(app)
      .post('/user/login')
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
  it('로그아웃 성공', done => {
    request(app)
      .post('/user/logout')
      .set('Cookie', [cookies])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          expect(res.body).to.equal('success to logout')
          done();
        }
      })
  })
  it('로그아웃 실패', done => {
    request(app)
    .post('/user/logout')
    .expect(401)
    .then(res => {
      expect(res.body).to.equal('로그인이 필요합니다.')
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  after(async () => {
    await prisma.$queryRaw(`DELETE FROM users WHERE id=${user_id};`)
  })
})
  
describe('로그인 정보 형식 오류', () => {
  const emailInvalidData = {
    'email': 'abc',
    'password': '12345678'
  }
  const pwInvalidData = {
    'email': 'testsignup2@test.com',
    'password': '123'
  }
  it('이메일 형식 오류', done => {
    request(app)
      .post('/user/signup')
      .send(emailInvalidData)
      .expect(400)
      .then(res => {
        expect(res.body.message).to.equal('이메일 형식이 올바르지 않습니다.')
        done();
      })
      .catch(err => {
        done(err);
      })
  })
  it('패스워드 형식 오류', done => {
    request(app)
      .post('/user/signup')
      .send(pwInvalidData)
      .expect(400)
      .then(res => {
        expect(res.body.message).to.equal('패스워드는 8자 이상이어야 합니다.')
        done();
      })
      .catch(err => {
        done(err);
      })
  })
})
