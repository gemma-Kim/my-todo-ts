import app from '../app';
import prisma from '../models';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { expect } from 'chai';

describe('사용자 기본 리스트 조회', () => {
  let user_id: number;
  let list_id: number;
  let cookie: string;
  let todos: any;
  const userData = {
    'email': 'signuptest3@test.com',
    'password': '12345678'
  }
  before(async () => {
    const hashedPw: string = await bcrypt.hash(userData.password, 12)
    const user = await prisma.users.create({
      data: {
        email: userData.email,
        password: hashedPw
      }
    })
    user_id = user.id
    const list = await prisma.lists.create({
      data: {
        title: 'Basic',
        user_id: user.id,
      }
    })
    list_id = list.id
    await prisma.todos.createMany({
      data: [
        { user_id: user.id, list_id: list.id, content: 'todo1' },
        { user_id: user.id, list_id: list.id, content: 'todo2' },
        { user_id: user.id, list_id: list.id, content: 'todo3' },
      ]
    })
    todos = await prisma.todos.findMany({
      where: {
        user_id: user_id,
        list_id: list_id,
      }
    })

  })

  after(async () => {
    await prisma.$queryRaw(`DELETE FROM users WHERE id=${user_id};`)
  })

  it('로그인 성공', done => {
    request(app)
      .post('/user/login')
      .send(userData)
      .expect(200)
      .then(res => {
        cookie = res.headers["set-cookie"].pop().split(";")[0];
        done()
      })
      .catch(err => {
        console.error(err)
        done(err)
      })
  })

  it('조회 성공', done => {
    request(app)
      .get(`/todo?offset=0&limit=5`)
      .set('Cookie', [cookie])
      .expect(200)
      .then(res => {
        expect(res.body).to.have.all.keys('id', 'lists', 'todos')
        expect(res.body.id).to.equal(user_id)
        expect(res.body.lists).to.eql([{ "id": list_id, "title": "Basic" }])
        expect(res.body.todos).to.eql([
          { "id": todos[0].id, "list_id": todos[0].list_id, "content": "todo1" },
          { "id": todos[1].id, "list_id": todos[1].list_id, "content": "todo2" },
          { "id": todos[2].id, "list_id": todos[2].list_id, "content": "todo3" },
        ])
        done()
      })
      .catch(err => {
        done(err)
      })
  })

})
