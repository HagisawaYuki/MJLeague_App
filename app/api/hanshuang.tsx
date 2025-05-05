"use server"
// import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client"

export type HanshuangWithHanshuangScore = Prisma.HanshuangGetPayload<{
    include: { scores: true }
}>