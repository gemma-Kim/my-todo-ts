import prisma from './index';

const getUserTodo = async (userId: number) => {
  return prisma.todo_lists.findMany({
    where: { 
      user_id: userId,
      deleted_is: false
    },
    select: {
      id: true,
      content: true
    }
  })
}

interface IinputTodoData {
  userId: number
  list_id: number
  content: string
}
const addTodo = (inputData: IinputTodoData) => {
  const { userId, list_id, content } = inputData
  return prisma.todo_lists.create({
    data: {
      user_id: userId,
      list_id: list_id,
      content: content,
    },
    select: {
      id: true,
      list_id: true,
      content: true,
    }
  })
}

interface IModifyTodoData {
  id: number
  list_id: number | undefined
  content: string | undefined
}
const modifyTodo = (inputData: IModifyTodoData) => {
  let { id: todoId, list_id: newListId, content: newContent } = inputData
  return prisma.todo_lists.update({
    where: {
      id: todoId,
    },
    data: {
      list_id: newListId,
      content: newContent
    }
  })
}

export {
  getUserTodo,
  addTodo,
  modifyTodo,
}