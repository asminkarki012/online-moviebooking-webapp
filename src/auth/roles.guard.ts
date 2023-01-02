import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'; import { Reflector } from '@nestjs/core'; import { Role } from './role.enum'; import { ROLES_KEY } from './roles.decorator';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private usersService:UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("roles guard ts canactivate");
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    //available user in request user
    const  request  = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}