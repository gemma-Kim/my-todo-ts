import { Router } from 'express'
import { isLoggedIn } from './middleware';
import { listModel } from '../models'

const listRouter = Router();

// 리스트 조회
// listRouter.get('/:user_id)', isLoggedIn, async (req, res, next) => {
//   try {
//     const result = await listModel.userDefaultList(Number(req.params.user_id))
    
//     return res.status(200).json(result)

//   } catch (err) {

//   }

// })
// 리스트 추가
listRouter.post('', isLoggedIn, async (req, res, next) => {

})

// 리스트 삭제
listRouter.delete('/', isLoggedIn, async (req, res, next) => {

})

export default listRouter