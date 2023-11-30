import { Role } from '~/enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return user?.level === role;
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
