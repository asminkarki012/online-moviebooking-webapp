import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport/dist";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./accessToken.strategy";
import { RefreshTokenStrategy } from "./refreshToken.strategy";
import { UserSchema } from "src/auth/schemas/user.schema";
// import { LoginOtpSchema } from './schemas/loginotp.schemas';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
