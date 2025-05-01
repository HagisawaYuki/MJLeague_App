import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';
import { compare } from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("AAAAA")
        if (!credentials?.username || !credentials?.password) {
            // throw new Error('Email and password required');
            return null;
        }
        const user = await prisma.user.findUnique({
          where: { name: credentials.username },
        });
        
        console.log("user",user?.password);
        console.log("credentials",credentials.password);
        if (!user || !user.password) {
            // throw new Error('ユーザーが存在しません')
            return null;
        };
        
        const isValid = await compare(credentials.password, user.password);
        console.log("isValid", isValid)
        if (!isValid) {
            // throw new Error('パスワードが間違っています')
            return null;
        };

        return user; // セッションに含まれる
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login', // カスタムログインページ
  },
  secret: process.env.NEXTAUTH_SECRET,
});