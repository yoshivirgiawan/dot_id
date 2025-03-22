import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      let message = 'Unauthorized';
      let code = 'UNAUTHORIZED';

      if (info?.name === 'TokenExpiredError') {
        message = 'Token has expired';
        code = 'TOKEN_EXPIRED';
      } else if (info?.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        code = 'INVALID_TOKEN';
      } else if (err) {
        message = err.message || 'Unauthorized';
      }

      throw new UnauthorizedException({
        success: false,
        error: {
          code,
          details: message,
        },
      });
    }

    return user;
  }
}
