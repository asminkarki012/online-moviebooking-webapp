import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,"jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretRefreshKey,
      passReqToCallback: true,
    });
  }

  async validate(req:Request,payload: any) {
    console.log("validate jwt payload in refreshtoken strategy");
    console.log(payload);
    // return payload;
    const refreshToken = req.get("Authorization").replace("Bearer","").trim();
    console.log(refreshToken);
    return {...payload,refreshToken};

    // return { userId: payload.sub, username: payload.username,roles:payload.roles };
  }
}