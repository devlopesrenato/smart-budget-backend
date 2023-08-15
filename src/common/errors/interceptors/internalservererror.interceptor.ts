import {
    CallHandler,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { InternalServerError } from '../types/InternalServerError';
  
  @Injectable()
  export class InternalServerErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError(error => {
          if (error instanceof InternalServerError) {
            throw new InternalServerErrorException(error.message);
          } else {
            throw error;
          }
        }),
      );
    }
  }