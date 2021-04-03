import prisma from './index';

const getUserTodo = async (userId: number) => {
  return prisma.todo_lists.findMany({
    where: { 
      user_id: userId,
      deleted_is: false,
    },
    select: {
      id: true,
      content: true,
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
  list_id?: number 
  content?: string
}
// 목록을 바꾸던가. 내용을 바꾼던가. 둘 다 기능하도록
const modifyTodo = (inputData: IModifyTodoData) => {
  const { id: todoId, list_id: newListId, content: newContent } = inputData
  if (newListId && !newContent) {
    return prisma.todo_lists.update({
      where: {
        id: todoId,
      },
      data: {
        list_id: newListId,
      }
    })
  }
  if (!newListId && !newContent)
  return prisma.todo_lists.update({
    where: {
      id: todoId,
    },
    data: {
      list_id: newListId,
      content: newContent,
    }
  })
}

// deleted_is: false => true
// const removeTodos = (todoIds: number[]) => {
//   return prisma.todo_lists.updateMany({
//     where: {
//       id: todoId,
//     },
//     data: {
//       deleted_is: true
//     },
//   })
// }

// // 
// const deleteTodos = (todoIds: number[]) => {

// }

export {
  getUserTodo,
  addTodo,
  modifyTodo,
  // removeTodos,
  // deleteTodos,
}