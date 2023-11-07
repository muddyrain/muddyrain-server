// global-auth.guard.ts
import { ResponseHelper } from '@/common/ResponseHelper.filter';
import { PRIVATE_KEY } from '@/constant/config';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    const response: Response = context.switchToHttp().getResponse();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (!isPublic) {
      if (!token) {
        response.status(401).json(ResponseHelper.error('Missing token', 401));
        return false;
      } else {
        const isValidate = jwt.verify(token, PRIVATE_KEY, (err) => {
          if (err) {
            response
              .status(401)
              .json(ResponseHelper.error('Invalid token', 401));
            return false;
          } else {
            return true;
          }
        });
        return isValidate as unknown as boolean;
      }
    } else {
      return true;
    }
  }
}
