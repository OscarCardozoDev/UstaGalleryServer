// src/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export type RoleName = 'student' | 'professor' | 'admin';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
