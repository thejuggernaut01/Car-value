import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

// To make use of DI, we mark the class as Injectable
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Promise<Observable<any>> {
    // Run something before a request is handled
    // by the request handler?.getRequest();
    const request = context.switchToHttp().getRequest();

    const { userId } = request.session || {};

    if (userId) {
      const user = this.usersService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
