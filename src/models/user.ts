import prisma from './index';

export interface userUniqueSearchInput {
  id?: number,
  email?: string
}

const findUser = async (data: userUniqueSearchInput) => {

  const user = await prisma.users.findUnique({
    where: { id: data['id'] }
  })
  return user;
}