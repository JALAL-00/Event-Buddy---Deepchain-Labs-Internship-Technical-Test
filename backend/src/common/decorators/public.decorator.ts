import { SetMetadata } from '@nestjs/common';
// This key will be used by our guards to identify public routes.
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);