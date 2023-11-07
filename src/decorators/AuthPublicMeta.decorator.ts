import { SetMetadata } from '@nestjs/common';

export const AuthPublicMeta = () => SetMetadata('isPublic', true);
