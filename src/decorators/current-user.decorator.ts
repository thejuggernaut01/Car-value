import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // data argument contains any data/argument we provide
  // to our decorator when we make use of it
  (data: never, context: ExecutionContext) => {
    // whatever we return shows up in our user argument
    // wherever we use that decorator

    const request = context.switchToHttp().getRequest();

    return request.currentUser;
  },
);
