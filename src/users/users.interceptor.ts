import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Users } from 'src/graphql/models/User';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<Users[]>,
  ): Observable<Users[]> | Promise<Observable<Users[]>> {
    return next.handle().pipe(
      map((data) =>
        data.map((user) => ({
          ...user,
          displayName: user.displayName ?? user.username,
        })),
      ),
    );
  }
}
