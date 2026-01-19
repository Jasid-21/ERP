import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtServiceCustom } from './JwtService';
import { IAuthRequest, IJwtPayload } from './AuthInterfaces';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtService = new JwtServiceCustom();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const payload = this.jwtService.tryVerify(token);
    if (!payload) throw new UnauthorizedException('Missing or invalid token');

    this.attachUser(request as IAuthRequest, payload);
    return true;
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  private attachUser(request: IAuthRequest, payload: IJwtPayload): void {
    request.user = payload;
  }
}
