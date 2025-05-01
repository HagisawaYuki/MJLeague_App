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

export const editUserPassword = async (name: string, password: string) => {
    await prisma.user.update({
        where: { name }, // 編集対象のID
        data: {
            password: password
        },
    });
}

