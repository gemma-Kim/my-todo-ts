import prisma, { userModel, todoModel, listModel } from '../models';

export class SignUpData {
    constructor(readonly body: { email: string, password: string }){
    }
    public isvalid(): { result: boolean, status: number, message?: string } {
      const email_validator = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
      if (email_validator.test(this.body.email) === false) {
        return { 'result': false, 'status': 400, 'message': '이메일 형식이 올바르지 않습니다.' }
      }
      if (this.body.password.length < 8) {
        return { 'result': false, 'status': 400, 'message': '패스워드는 8자 이상이어야 합니다.' }
      }
      
        return { 'result': true, 'status': 200 }
    }
}
