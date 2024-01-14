import {Injectable, CanActivate, ExecutionContext, SetMetadata} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@/utils/const'
import {HttpStatusError} from "@/utils/httpStatus.service";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export {
	Role
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredRoles) {
			return true;
		}
		const { user } = context.switchToHttp().getRequest();
		const res = requiredRoles.some((role) => user.roles?.includes(role))
		if(!res) {
			HttpStatusError.fail(`无权限进行此操作`)
		}
		return res;
	}
}
