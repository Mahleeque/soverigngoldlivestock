import { UserRole } from '../constants/enums';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
      tokenVersion: number;
    }

    interface Request {
      user?: User;
      rawBody?: Buffer;
    }
  }
}

export {};
