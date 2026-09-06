import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Discord from 'next-auth/providers/discord'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'
import { verifyPassword } from './password'

const DEMO_EMAIL = process.env.DEMO_EMAIL || 'demo@donutsmp.gg'
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'donutsmp'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [
          Discord({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '')
          .trim()
          .toLowerCase()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null

        const dbUser = await prisma.user.findUnique({ where: { email } })
        if (dbUser?.passwordHash) {
          const ok = await verifyPassword(password, dbUser.passwordHash)
          if (!ok) return null
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.image,
          }
        }

        const valid =
          email === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD
        if (!valid) return null

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: 'Demo Player',
            emailVerified: new Date(),
          },
        })

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
})
