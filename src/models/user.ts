import prisma from './index';

const createNewUser = (email: string, password: string) => {
  return prisma.users.create({
    data: {
      email: email,
      password: password,
    },
    select: { id: true }
  });
}

interface IinputUserData {
  id?: number | undefined
  email?: string | undefined
}

const findUniqueUser = (inputData: IinputUserData) => {
  const { id: inputId, email: inputEmail } = inputData;
  const user = prisma.users.findUnique({
    where: {
      id: inputId,
      email: inputEmail
    },
    select: { id: true },
  });
  if (user) {
    return user
  }
  return false
}


export {
  createNewUser,
  findUniqueUser
}