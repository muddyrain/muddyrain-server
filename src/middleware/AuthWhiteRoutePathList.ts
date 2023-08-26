import { RequestMethod } from '@nestjs/common';

export const whiteRoutePathList: {
  path: RegExp;
  method: keyof typeof RequestMethod;
}[] = [
  {
    path: /^\/user/,
    method: 'GET',
  },
  {
    path: /^\/banner/,
    method: 'GET',
  },
  {
    path: /^\/user\/.*$/,
    method: 'PUT',
  },
];
