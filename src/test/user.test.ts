import app from '../app';
import { json, Request, Response } from 'express';
import prisma, { userModel } from '../models'
import { expect } from 'chai';
import * as request from 'supertest';
import * as superagent from 'superagent';
import { isLoggedIn, isNotLoggedIn } from '../routes/middleware';

const agent = superagent.agent();

describe('POST signup api', () => {
  after(async () => {
    await prisma.$queryRaw('DELETE FROM users ORDER BY id DESC LIMIT 1;')
  })
  it('success: signup', (done) => {
    request(app)
      .post('/users/signup')
      .send({
        'email': 'testsignup@test.com',
        'password': '12345678'
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      })
  })
})

describe('POST login api', () => {

  const userData = {
    "email": "testuser@test.com",
    "password": "12345678"
  }
  before(async () => {
    await userModel.createNewUser(userData.email, userData.password)
  })
  after(async () => {
    await prisma.users.delete({
      where: {
        email: userData.email
      }
    })
  })
  it('success: login', (done) => {
    request(app)
      .post('/users/login')
      .send(userData)
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

