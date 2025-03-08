import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.rawHeaders;
    // const user = req.user;
    //
    // if (!user) throw new InternalServerErrorException('User not found');
    //
    // return !data ? user : user[data];
  },
);
