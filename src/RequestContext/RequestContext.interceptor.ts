// request-context.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { requestContext } from './RequestContext';
import { IAuthRequest } from 'src/modules/Auth/AuthInterfaces';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: IAuthRequest = context.switchToHttp().getRequest();

    return new Observable((subscriber) => {
      requestContext.run(
        {
          userId: req.user?.id,
        },
        () => {
          next.handle().subscribe(subscriber);
        },
      );
    });
  }
}
