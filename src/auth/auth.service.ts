import {
  Injectable,
  Logger,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer/dist";
import { Model } from "mongoose";
import { UserDocument } from "src/auth/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { RegisterUserDto } from "./dtos/user.dto";
import { User } from "./interfaces/user.interface";
import { jwtConstants } from "src/config";

@Injectable()
export class AuthService {
  logger: Logger;
  tokenList = new Object();
  constructor(
    private jwtService: JwtService,
    private mailService: MailerService,

    @InjectModel("User") private readonly userModel: Model<UserDocument>
  ) {
    // this.logger = new Logger("Validation logger");
  }

  async findAll(): Promise<User[]> {
    console.log("findAll function");
    return await this.userModel.find();
  }

  async findOne(email: string): Promise<User> {
    console.log("findOne function");
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async deleteUser(email: string): Promise<User> {
    return await this.userModel.findOneAndDelete({ email: email });
  }

  async updateUser(email: string, user: User): Promise<User> {
    const updateUser = await this.userModel.findOneAndUpdate(
      { email: email },
      {
        $set: user,
      },
      { new: true }
    );
    const { password, ...result } = updateUser;
    return result;
  }

  async registerUser(registerUser: RegisterUserDto): Promise<any> {
    const { email, password, confirmPassword } = registerUser;
    const user = await this.userModel.findOne({ email: email });
    if (user) {
      return new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }
    if (password !== confirmPassword) {
      return new HttpException(
        "Password Doesnot Match",
        HttpStatus.BAD_REQUEST
      );
    }
    const newUser = new this.userModel(registerUser);
    // newUser.password = await bcrypt.hash(newUser.confirmPassword, 10);
    this.mailer(email);
    await newUser.save();
    return { success: true, message: "Register Successfully", data: newUser };
  }

  async validateUser(email: string, password: string): Promise<any> {
    console.log("Auth service validate User");
    const user = await this.userModel.findOne({ email: email });
    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    // console.log(user);
    if (user && password === user.password) {
      console.log(user);
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    //called from login controller

    console.log("JWT validation");
    console.log(user);
    console.log(user.email, user._id);
    if (user.active !== true) {
      return "Email not Verified";
    }

    //payload for JWT validation
    const payload = { username: user.email, sub: user._id, roles: user.roles};
    const tokens = await this.getTokens(payload);
    this.tokenList[tokens.refreshToken] = tokens;
    // console.log(this.tokenList);
    return tokens;
  }

  async getTokens(payload: any) {
    console.log("getToken function");
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.accessTokenSecret,
        expiresIn: "10h",
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secretRefreshKey,
        expiresIn: "24h",
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(payload: any, refreshToken: string): Promise<object> {
    console.log("Running refreshtokens function");
    console.log(refreshToken);
    const { iat, exp, ...data } = payload;
    if (refreshToken in this.tokenList) {
      const tokens = await this.getTokens(data);
      return { accessToken: tokens.accessToken };
    } else {
      throw new ForbiddenException("Access Denied");
    }
  }

  async changePassword(payload: any, changePassword: any): Promise<Object> {
    console.log("changePassword function working");
    console.log(payload);
    //for future update use access token payload to get email done
    // payload.username contains email
    const user = await this.userModel.findOne({ email: payload.username });

    console.log(user);
    if (!user) {
      return new NotFoundException();
    }
    const oldpassword = changePassword.oldpassword;
    // const validated = await bcrypt.compare(oldpassword, user.password);
    // console.log(validated);
    if (oldpassword !== user.password) {
      return new UnauthorizedException();
    }
    const newpassword = changePassword.newpassword;
    const confirmpassword = changePassword.confirmpassword;
    if (newpassword !== confirmpassword) {
      return { message: "New Password doesnot match with confirmpassword" };
    }

    // const newhashedPass = await bcrypt.hash(confirmpassword, 10);
    const updatedPasswordUser = await this.updatePassword(
      user.email,
      confirmpassword
    );

    console.log(updatedPasswordUser);
    return updatedPasswordUser;
  }

  //send otp mail to user to change active status of user
  async mailer(recepient: string): Promise<any> {
    console.log("authservice mailer function");
    const otp = Math.floor(1000 + Math.random() * 9000);
    // const hashedOtp
    console.log(otp);

    await this.mailService.sendMail({
      to: recepient,
      from: "noreply <noreplymoviebookingmail@gmail.com>",
      subject: "User Verification",
      html: `<p>Your OTP code is <b> ${otp} </b> </p>
       <p> expires in 2 minutes <p>`,
    });

    return this.addOtp(recepient, otp);
  }

  //otp verification after registeration
  async otpVerify(email: string, otp: number): Promise<any> {
    console.log("otpVerify function in authservice");
    const user = await this.userModel.findOne({ email: email });

    //check otp expiration time for 2 minutes
    if (Date.now() - user.otpExpiresAt >= 120000) {
      return { message: "OTP expired" };
    }

    if (user.otp === otp) {
      return this.updateActive(user.email);
    } else {
      return { message: "Invalid OTP" };
    }
  }

  //send otp mail to user for forgotpassword
  async forgotPasswordMailer(recepient: string): Promise<any> {
    console.log("authservice mailer function");
    const otp = Math.floor(1000 + Math.random() * 9000);
    // const hashedOtp
    console.log(otp);

    await this.mailService.sendMail({
      to: recepient,
      from: "Testingnoreply@gmail.com",
      subject: "Reset Your Password",
      html: `Your OTP code is <b>${otp}</b> to reset password \n expires in 1 minute`,
    });
    await this.initialForgotPasswordFlag(recepient);
    return this.forgotPasswordAddOtp(recepient, otp);
  }

  //otp verification for forgotpassword
  async forgotPasswordOtpVerify(otpDto: any) {
    console.log("forgotpasswordotpVerify function in authservice");
    const user = await this.findOne(otpDto.email);
    console.log(user);
    // console.log(user.otpExpiresAt-Date.now());

    //check otp expiration time for 10 minutes
    if (Date.now() - user.forgotPasswordOtpExpiresAt >= 600000) {
      return { message: "OTP expired" };
    }

    if (user.forgotPasswordOtp === otpDto.otp) {
      return await this.updateForgotPasswordFlag(user.email);
    } else {
      // await this.updateForgotPasswordFlag(user.email);
      return { message: "Invalid OTP" };
    }
  }

  async forgotPasswordChange(forgotPassword: any): Promise<any> {
    const user = await this.findOne(forgotPassword.email);
    console.log(user.forgotPasswordOtpExpiresAt);
    if (
      Date.now() - user.forgotPasswordOtpExpiresAt <= 600000 &&
      user.forgotPasswordOtpFlag === true &&
      user.active === true
    ) {
      const newpassword = forgotPassword.newpassword;
      const confirmpassword = forgotPassword.confirmpassword;
      if (newpassword !== confirmpassword) {
        return { message: "New Password doesnot match with confirmpassword" };
      }
      const updatedForgotPassword = await this.updatePassword(
        user.email,
        confirmpassword
      );
      this.initialForgotPasswordFlag(user.email);
      return { success: true, message: "Forgot password updated successfully" };
    } else {
      // const updatedForgotPassword =
      //   await this.updateForgotPasswordFlag(user.email);
      this.initialForgotPasswordFlag(user.email);
      return {
        message: "Forgot Password change time expired",
      };
    }
  }

  //adding otp in db and also reseting expiration time
  async addOtp(email: string, otp: number): Promise<object> {
    console.log("add otp in user service");
    const updatedOtp = await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { otp: otp, otpExpiresAt: Date.now() } },
      { new: true }
    );
    return updatedOtp;
  }

  //when user is verified its active status is set to true
  async updateActive(email: string): Promise<String> {
    console.log("users service updateactive function");
    console.log(email);
    await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { active: true, otpExpiresAt: Date.now() } },
      { new: true }
    );
    return "Email Verification successfull";
  }

  //adding forgotPasswordotp in db and also reseting its expiration time
  async forgotPasswordAddOtp(email: string, otp: number):Promise<{success:Boolean,message:string,data:object}>{
    console.log("add forgot password otp in user service");
    const updatedForgotPasswordOtp = await this.userModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          forgotPasswordOtp: otp,
          forgotPasswordOtpExpiresAt: Date.now(),
        },
      },
      { new: true }
    );
    return {success:true,message:"Forgot Password OTP send successfully",data:updatedForgotPasswordOtp};
  }

  //after verification of forgotpasswordotp its flag is set to true
  async updateForgotPasswordFlag(email: string): Promise<object> {
    console.log("users service updateforgotpasswordflag function");
    console.log(email);
    const user = await this.userModel.findOne({ email: email });
    // user.forgotPasswordOtpFlag = true;
    if (user.forgotPasswordOtpFlag === false) {
      const updateForgotPasswordFlag = await user.updateOne(
        { $set: { forgotPasswordOtpFlag: true } },
        { new: true }
      );
      return {
        success: true,
        message: "You can your resetpassword",
        data:updateForgotPasswordFlag,
      };
    }
  }

  //initializing forgotpassword so that user cannot reset password unless forgotpassword is verified
  async initialForgotPasswordFlag(email: string): Promise<object> {
    const user = await this.userModel.findOne({ email: email });
    // user.forgotPasswordOtpFlag = true;
    const updateForgotPasswordFlag = await user.updateOne(
      { $set: { forgotPasswordOtpFlag: false } },
      { new: true }
    );
    return updateForgotPasswordFlag;
  }

  async updatePassword(email: string, confirmpassword: string):Promise<object> {

    console.log("updatePassword function in users service");

    // const newhashedPass = await bcrypt.hash(confirmpassword, 10);
    const updatedPassword = await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { password: confirmpassword } },
      { new: true }
    );
    return {success:true,message:"Password Updated Successfully",data:updatedPassword};
  }

  // async uploadProfilePic(email: string, file: object): Promise<Object> {
  //   const addProfilePic = await this.userModel.findOneAndUpdate(
  //     { email: email },
  //     {
  //       $set: { profilepic: file },
  //     },
  //     { new: true }
  //   );

  //   return { success: true, data: addProfilePic };
  // }
}
