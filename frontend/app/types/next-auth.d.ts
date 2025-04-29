import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extend the built-in Session type
   */
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }

  /**
   * Extend the built-in User type
   */
  interface User {
    id: string;
    role?: string;
  }
} 