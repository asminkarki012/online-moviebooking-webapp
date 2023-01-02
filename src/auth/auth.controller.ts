import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Delete,
  Logger,
  Param,
  Request,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { RegisterUserDto } from "src/auth/dtos/user.dto";
import { User } from "src/auth/interfaces/user.interface";
import { AccessTokenGuard } from "./accessToken.guard";
import { RefreshTokenGuard } from "./refreshToken.guard";
import { Roles } from "./roles.decorator";
import { Role } from "./role.enum";
import { RolesGuard } from "./roles.guard";
import { ChangePasswordDto } from "./dtos/changepassword.dto";
import { Req, UploadedFile, UseInterceptors } from "@nestjs/common/decorators";
import { OtpDto } from "./dtos/otp.dto";
import { ForgotPasswordDto } from "./dtos/forgotpassword.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProfilePicDto } from "./dtos/profilepic.dto";
@Controller("/api/auth/users")
export class AuthController {
  private readonly logger = new Logger();
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post("/register")
  registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    console.log("register route");
    //send otp to user

    return this.authService.mailer(registerUserDto.email);
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  login(@Request() req): any {
    // information are stored in request
    console.log("login route");
    //return everything except password
    const { password, ...result } = req.user._doc;

    return this.authService.login(result);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get("/getallusers")
  findAll(): Promise<User[]> {
    console.log("getall users route");
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.User)
  @Get(":email")
  findOne(@Param("email") email): Promise<User> {
    console.log("get one user route");
    return this.usersService.findOne(email);
  }

  //route to get access token from refresh token
  @UseGuards(RefreshTokenGuard)
  @Get("/options/accesstoken")
  refreshTokens(@Request() req): any {
    console.log("in getaccesstoken route");
    console.log(req.user);
    const { refreshToken, ...payload } = req.user;
    console.log(payload, refreshToken);
    return this.authService.refreshTokens(payload, refreshToken);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.User)
  @Put(":email")
  updateUser(
    @Param("email") email,
    @Body() updateUser: RegisterUserDto
  ): Promise<User> {
    return this.usersService.updateUser(email, updateUser);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(":email")
  deleteUser(@Param("email") email): Promise<User> {
    return this.usersService.deleteUser(email);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.User)
  @Put("options/changeuserpassword")
  changePassword(
    @Body() changePassword: ChangePasswordDto,
    @Req() req
  ): Promise<object> {
    console.log("change password route working");
    console.log(changePassword);
    console.log(typeof changePassword);
    const { ...payload } = req.user;
    return this.authService.changePassword(payload, changePassword);
  }

  @Post("/options/verifyotp")
  otpVerify(@Body() verifyOtp: OtpDto): Promise<string> {
    console.log("verify otp route");
    console.log(verifyOtp.email);
    console.log(verifyOtp.otp);
    return this.authService.otpVerify(verifyOtp.email, verifyOtp.otp);
  }

  @Post("/options/resendotp")
  resendOtp(@Body() Otp: OtpDto): Promise<string> {
    console.log("resend otp route");
    return this.authService.mailer(Otp.email);
  }

  @Post("/options/sendforgotpasswordotp")
  sendForgotPasswordOtp(@Body() Otp: OtpDto): Promise<string> {
    console.log("sendforgotpasswordotp route");
    return this.authService.forgotPasswordMailer(Otp.email);
  }

  @Post("/options/forgotpasswordotpverify")
  forgotPasswordOtpVerify(@Body() otpDto: OtpDto) {
    console.log("forgotPasswordOtpVerify route");
    //resetpassword via resetpassword otp
    //first validate the resetpassword otp it expires in 1 minute
    //then change go to resetpassword route
    return this.authService.forgotPasswordOtpVerify(otpDto);
  }

  @Put("/options/forgotpasswordchange")
  forgotPasswordChange(@Body() forgotPassword: ForgotPasswordDto) {
    console.log("forgotPasswordchange route");
    return this.authService.forgotPasswordChange(forgotPassword);
  }

  // @Post("/upload/profilepic")
  // @UseInterceptors(FileInterceptor("profilepic"))
  // uploadFile(
  //   @Body() fileDto: ProfilePicDto,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 250000 }), //250kb
  //         new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
  //       ],
  //     })
  //   )
  //   file: Express.Multer.File
  // ) {
  //   console.log(file);
  //   return this.authService.uploadProfilePic(fileDto.email, file);
  // }
}
