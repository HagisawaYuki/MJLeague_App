"use server"
import prisma from "../../lib/prisma";


export const searchAllUsers = async () => {
    const users = await prisma.user.findMany({});
    return users;
}

export const searchUserByName = async (name: string) => {
    const user = await prisma.user.findUnique({
        where: {name}
    });
    return user;
}

export const searchUserByID = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {id}
    });
    console.log(user?.name)
    return user;
}

//追加したgame(データベース上で一番したの情報)のidを検索
export const searchUserIDByName = async (name: string): Promise<string> => {
    const user = await prisma.user.findUnique({
        where: {name},
        select: {
            id: true,
        },
    });
    return user ? user.id : "";
}

export const createUser = async (name: string, hashedPassword: string) => {
    await prisma.user.create({
        data: {
          name,
          password: hashedPassword,
        },
    });
}

export const editUserPassword = async (name: string, password: string) => {
    await prisma.user.update({
        where: { name },
        data: {
            password: password
        },
    });
}

