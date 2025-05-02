import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';
import { compare } from 'bcryptjs';
import { searchUserByName } from '../../../app/api/user';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
            throw new Error('Email and password required');
        }
        
        const user = await searchUserByName(credentials.username);
        
        if (!user || !user.password) {
            throw new Error('ユーザーが存在しません')
        };
        
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
            throw new Error('パスワードが間違っています')
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