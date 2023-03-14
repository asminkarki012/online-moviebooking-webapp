import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { jwtConstants } from "src/config";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretRefreshKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    console.log("validate jwt payload in refreshtoken strategy");
    console.log(payload);
    // return payload;
    const refreshToken = req.get("Authorization").replace("Bearer", "").trim();
    console.log(refreshToken);
    return { ...payload, refreshToken };

    // return { userId: payload.sub, username: payload.username,roles:payload.roles };
  }
}
