import prisma from './index';

interface IinputTodoData {
  user_id: number
  list_id: number
  content: string
}
const addTodo = (data: IinputTodoData) => {
  return prisma.todos.create({
    data,
    select: {
      id: true,
      list_id: true,
      user_id: true,
      content: true,
    }
  })
}

const getUserTodo = async (id: number, offset: number, limit: number) => {
  return prisma.users.findMany({
    where: {
      id
    },
    select: {
      id: true,
      lists: {
        select: {
          id: true,
          title: true,
        }
      },
      todos: {
        select: {
          id: true,
          list_id: true,
          content: true,
        },
        where: {
          is_deleted: false,
          lists: {
            default: true
          }
        },
        orderBy: {
          created_at: 'asc',
        }
        
      }
    },     
  })
}

interface IModifyTodoData1 {
  content: string
} 
interface IModifyTodoData2 {
  list_id: number
}
interface IModifyTodoData3 {
  is_deleted: boolean
}
const modifyTodo = (id: number[], data: IModifyTodoData1 | IModifyTodoData2 | IModifyTodoData3) => {
  try {
    return prisma.todos.updateMany({
          where: {
            is_deleted: false,
            id: {
              in: id
            }
          },
          data: {
            ...data,
            updated_at: new Date()
          }
      })

  } catch (err) {
    console.error(err)
  }
}


const deleteTodos = (todo_id: number[]) => {
  return prisma.todos.deleteMany({
    where: {
      id: { 
        in: todo_id 
      },
    },
  })
}

export {
  addTodo,
  getUserTodo,
  modifyTodo,
  deleteTodos,
}