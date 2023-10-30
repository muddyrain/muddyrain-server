import { ResponseHelper } from '@/common/ResponseHelper.filter';
import { PRIVATE_KEY, envConfig } from '@/constant/config';
import { NestMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { whiteRoutePathList } from './AuthWhiteRoutePathList';

export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    const currentUrl = req.baseUrl.replace(envConfig('GLOBAL_PREFIX'), '');
    /**
     * 受白名单保护的路径 和 受白名单方式保护的
     * 不受token校验
     */
    const isWhiteListed = whiteRoutePathList.some((route) => {
      const pathMatch = route.path.test(currentUrl);
      return pathMatch && route.method === req.method;
    });
    if (isWhiteListed) {
      return next();
    }
    if (!token) {
      return res.status(401).json(ResponseHelper.error('Missing token', 401));
    } else {
      jwt.verify(token, PRIVATE_KEY, (err) => {
        console.log('err', err);
        if (err) {
          return res
            .status(401)
            .json(ResponseHelper.error('Invalid token', 401));
        } else {
          next();
        }
      });
    }
  }
}
