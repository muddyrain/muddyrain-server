import { ResponseHelper } from '@/common/ResponseHelper.filter';
import { PRIVATE_KEY, envConfig } from '@/constant/config';
import { NestMiddleware, RequestMethod } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const whiteRoutePathList: {
  path: string;
  method: keyof typeof RequestMethod;
}[] = [
  {
    path: '/user/login',
    method: 'POST',
  },
];

export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    const currentUrl = req.baseUrl.replace(envConfig('GLOBAL_PREFIX'), '');
    /**
     * 受白名单保护的路径 和 受白名单方式保护的
     * 不受token校验
     */
    if (
      whiteRoutePathList.some(
        (route) => route.path === currentUrl && route.method === req.method,
      )
    ) {
      return next();
    }
    if (!token) {
      return res.status(401).json(ResponseHelper.error('Missing token', 401));
    }

    const isValidToken = jwt.verify(token, PRIVATE_KEY);
    if (!isValidToken) {
      return res.status(401).json(ResponseHelper.error('Invalid token', 401));
    }
    next();
  }
}
