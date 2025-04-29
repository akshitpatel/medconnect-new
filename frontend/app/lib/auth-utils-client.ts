import { jwtVerify, JWTPayload } from 'jose';

// JWT Secret from environment variables (browser-safe)
const JWT_SECRET = process.env.JWT_SECRET || 'healcard_jwt_secret_key';

export interface JwtPayload {
  userId?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

// Verify JWT token (browser-safe, async)
export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  console.log('[JWT DEBUG] verifyToken: JWT_SECRET (full):', JWT_SECRET);
  console.log('[JWT DEBUG] verifyToken: JWT_SECRET char codes:', Array.from(JWT_SECRET).map(c => c.charCodeAt(0)));
  console.log('[JWT DEBUG] verifyToken: algorithm:', 'HS256');
  try {
    console.log('[JWT DEBUG] Verifying token:', token);
    console.log('[JWT DEBUG] JWT_SECRET in use:', JWT_SECRET.slice(0, 7) + '... (length: ' + JWT_SECRET.length + ')');
    // jose requires the secret as a Uint8Array
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
    console.log('[JWT DEBUG] Decoded payload:', payload);
    return payload as JwtPayload;
  } catch (error) {
    console.error('[JWT DEBUG] Token verification failed:', error);
    return null;
  }
};
