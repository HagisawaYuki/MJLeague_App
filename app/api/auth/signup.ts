import { hash } from "bcryptjs";
// import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { createUser, searchUserByName } from "../user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("AAAAA")
  if (req.method !== "POST") return res.status(405).end();

  console.log("BBBBB")
  const { name, password } = req.body;

  console.log("CCCCC")
  if (!name || !password) {
    return res.status(400).json({ message: "名前とパスワードが必要です" });
  }

  console.log("DDDDD")
  try {
    // 既存ユーザー確認
    // const existingUser = await prisma.user.findUnique({ where: { name } });
    const existingUser = await searchUserByName(name);
    if (existingUser) {
      return res.status(400).json({ message: "すでに登録されています" });
    }

    // パスワードハッシュ化
    const hashedPassword = await hash(password, 10);

    
    await createUser(name, hashedPassword);

    return res.status(200).json({ message: "ユーザー登録成功" });
  } catch  {
    return res.status(500).json({ message: "サーバーエラー" });
  }
}