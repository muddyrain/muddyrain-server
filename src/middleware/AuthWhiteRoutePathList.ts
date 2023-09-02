import { RequestMethod } from '@nestjs/common';

export const whiteRoutePathList: {
  path: RegExp;
  method: keyof typeof RequestMethod;
}[] = [
  {
    path: /^\/user\/login/,
    method: 'POST',
  },
  {
    path: /^\/banner/,
    method: 'GET',
  },
  // {
  //   path: /^\/user\/.*$/,
  //   method: 'PUT',
  // },
];
