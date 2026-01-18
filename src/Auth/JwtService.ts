import * as jwt from 'jsonwebtoken';
import { IJwtPayload } from './AuthInterfaces';

export class JwtServiceCustom {
  private readonly secret: string;
  private readonly expiresIn: number;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    this.secret = process.env.JWT_SECRET;
    this.expiresIn = Number(process.env.JWT_EXPIRES_IN) || 2592000;
  }

  /**
   * Genera un JWT firmado
   */
  sign(payload: IJwtPayload): string {
    console.log('Payloas', payload);
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  /**
   * Verifica un JWT y devuelve el payload
   */
  verify(token: string): IJwtPayload {
    try {
      return jwt.verify(token, this.secret) as unknown as IJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('JWT expired');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid JWT');
      }

      throw error;
    }
  }

  /**
   * Verifica sin lanzar excepción
   */
  tryVerify(token: string): IJwtPayload | null {
    try {
      return this.verify(token);
    } catch {
      return null;
    }
  }
}
