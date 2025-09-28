import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verifyAdminPassword, getAdminByUsername } from './db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const isValid = await verifyAdminPassword(
            credentials.username as string,
            credentials.password as string
          );

          if (!isValid) {
            return null;
          }

          const user = await getAdminByUsername(credentials.username as string);
          
          if (!user) {
            return null;
          }

          return {
            id: user.id,
            name: user.username,
            email: `${user.username}@admin.local`, // Dummy email for NextAuth
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPage = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdminPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      return true;
    },
    session: async ({ session, token }) => {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
