import { Request } from 'express';

export interface IJwtPayload {
  id: number;
  username: string;
  email: string;
}

export interface IAuthRequest extends Request {
  user: IJwtPayload;
}
