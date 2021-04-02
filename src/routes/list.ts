import { Router } from 'express'
import { isLoggedIn } from './middleware';
import { listModel } from '../models'

const listRouter = Router();

// 리스트 추가
listRouter.post('', isLoggedIn, async (req, res, next) => {

})

// 리스트 삭제
listRouter.delete('/', isLoggedIn, async (req, res, next) => {

})

export default listRouter