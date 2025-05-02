import { hash } from "bcryptjs";
// import prisma from "../../../lib/prisma";
// import type { NextApiRequest, NextApiResponse } from "next";
import { createUser, searchUserByName } from "../../user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // if (req.method !== "POST") return res.status(405).end();

  const body = await req.json();
  const { name, password } = body;

  if (!name || !password) {
    return NextResponse.json({ message: '名前とパスワードが必要です' });
    // return res.status(400).json({ message: "名前とパスワードが必要です" });
  }

  try {
    // 既存ユーザー確認
    // const existingUser = await prisma.user.findUnique({ where: { name } });
    const existingUser = await searchUserByName(name);
    if (existingUser) {
      return NextResponse.json({ message: 'すでに登録されています' });
      // return res.status(400).json({ message: "すでに登録されています" });
    }

    // パスワードハッシュ化
    const hashedPassword = await hash(password, 10);

    
    await createUser(name, hashedPassword);

    return NextResponse.json({ message: 'ユーザー登録成功' });
    // return res.status(200).json({ message: "ユーザー登録成功" });
  } catch  {
    return NextResponse.json({ message: 'サーバーエラー' });
    // return res.status(500).json({ message: "サーバーエラー" });
  }
}