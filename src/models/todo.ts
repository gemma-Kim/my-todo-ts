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
          created_at: 'desc',
        }
        
      }
    },     
  })
}

interface IModifyTodoData1 {
  id: number
  content: string
} 
interface IModifyTodoData2 {
  id: number[]
  list_id: number
}
interface IModifyTodoData3 {
  id: number[]
  is_deleted: boolean
}
const modifyTodo = (data: IModifyTodoData1 | IModifyTodoData2 | IModifyTodoData3) => {
  try {
    if ("content" in data) {
      const { id, content } = data
      return prisma.todos.update({
        where: {
          id
        },
        data: {
          content,
          updated_at: new Date()
        },
        select: {
          id: true,
          list_id: true,
          content: true
        }
      })
    } else if ("list_id" in data ) {
      const { id, list_id } = data
      if (list_id) {
        return prisma.todos.updateMany({
          where: {
            is_deleted: false,
            id: {
              in: id
            }
          }, 
          data: {
            list_id,
            updated_at: new Date()
          },
        })
      }
    } else if ("is_deleted" in data) {
      const { id, is_deleted } = data
      if (is_deleted === false) {
        return prisma.todos.updateMany({
          where: {
            is_deleted: false,
            id: {
              in: id
            }
          }, 
          data: {
            is_deleted: true,
            updated_at: new Date()
          },
        })
      } 
    } else {
      return null
    }    
  } catch (err) {
    console.error(err)
  }
}

const deleteTodos = (todoIds: number[], is_deleted: boolean) => {
  // it's already removed
  if (is_deleted) {
    return prisma.todos.deleteMany({
      where: {
        id: { in: todoIds },
      },
    })
  } else {
    // remove them
    return prisma.todos.updateMany({
      where: {
        id: { in: todoIds },
      },
      data: {
        is_deleted: true
      }
    })
  }
  
}

export {
  addTodo,
  getUserTodo,
  modifyTodo,
  deleteTodos,
}