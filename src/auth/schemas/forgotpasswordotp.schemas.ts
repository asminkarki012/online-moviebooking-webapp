/*import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "src/auth/role.enum";

// export type UserDocument = User & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: "user" })
  roles: Role[];

  //email verification otp
  @Prop()
  otp: Number;

  @Prop({ default: Date.now() })
  otpExpiresAt: Number;

  @Prop({ default: false }) //when true user can login else cannot login
  active: Boolean;

  //forgotpassword otp
  @Prop()
  forgotPasswordOtp: Number;

  @Prop()
  forgotPasswordOtpExpiresAt: number;
  // @Prop({default:false})
  forgotPasswordOtpFlag: Boolean;
}
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual("forgotPasswordOtpFlag").get(function (this: UserDocument) {
  if (Date.now() - this.forgotPasswordOtpExpiresAt >= 60000) {
    return (this.forgotPasswordOtpFlag = false);
  } else if (
    this.forgotPasswordOtp &&
    Date.now() - this.forgotPasswordOtpExpiresAt <= 60000
  ) {
    return (this.forgotPasswordOtpFlag = true);
  }
});
// export const UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     unique: true,
//     require: true,
//   },
//   password: {
//     type: String,
//     require: true,
//   },
//   roles: { type: [String], default: "user" },
// });
export { UserSchema };



*/