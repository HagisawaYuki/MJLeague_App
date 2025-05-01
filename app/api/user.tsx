"use server"
import prisma from "@/lib/prisma";


export const searchAllUser = async() => {
    const users = await prisma.user.findMany({});
    return users;
}