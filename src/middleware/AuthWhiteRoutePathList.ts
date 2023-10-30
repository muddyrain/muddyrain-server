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
    path: /^\/utils\/upload/,
    method: 'POST',
  },
  {
    path: /^\/banner/,
    method: 'GET',
  },
  // {
  //   path: /^\/user/,
  //   method: 'POST',
  // },
  // {
  //   path: /^\/user\/.*$/,
  //   method: 'PUT',
  // },
];
