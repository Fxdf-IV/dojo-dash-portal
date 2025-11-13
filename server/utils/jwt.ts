import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): { id: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch {
    return null;
  }
};
