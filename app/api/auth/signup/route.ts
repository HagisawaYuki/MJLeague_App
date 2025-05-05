export const runtime = 'nodejs'
import { hash } from "bcryptjs";

import { createUser, searchUserByName } from "../../user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json();
  const { name, password } = body;

  if (!name || !password) {
    return NextResponse.json({ message: '名前とパスワードが必要です' });
  }

  try {
    // 既存ユーザー確認
    const existingUser = await searchUserByName(name);
    if (existingUser) {
      return NextResponse.json({ message: 'すでに登録されています' });
    }

    // パスワードハッシュ化
    const hashedPassword = await hash(password, 10);

    await createUser(name, hashedPassword);

    return NextResponse.json({ message: 'ユーザー登録成功' });
  } catch  {
    return NextResponse.json({ message: 'サーバーエラー' });
  }
}