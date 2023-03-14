import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable,Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  private readonly logger = new Logger(); 

  constructor(private authService: AuthService) {
    //initializing is needed for local strategy read doc
    super({usernameField:"email"});
  }

    // this.logger.debug("local strategy");
  async validate(email:string,password:string): Promise<any> {
    console.log("VALIDATE FUNCTION in local strategy");
    const user = await this.authService.validateUser(email,password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}