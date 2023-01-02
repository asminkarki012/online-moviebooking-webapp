/*import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserSchema } from "src/users/schemas/user.schema";
import { User } from "src/users/schemas/user.schema";
import * as mongoose from "mongoose";
export type LoginOtpDocument = LoginOtp & Document;

@Schema({
  timestamps:true,
  toJSON: {
    virtuals: true,
  },
})
export class LoginOtp {
  @Prop({ required: true, unique: true,ref:"User"})
  userId:mongoose.Schema.Types.ObjectId; 

  //email verification otp
  @Prop()
  otp: Number;

  @Prop({default:Date.now(),expires:"2m"})
  createdAt:Date;

}
const LoginOtpSchema = SchemaFactory.createForClass(LoginOtp);

// UserSchema.virtual("forgotPasswordOtpFlag").get(function (this: UserDocument) {
//   if (Date.now() - this.forgotPasswordOtpExpiresAt >= 60000) {
//     return (this.forgotPasswordOtpFlag = false);
//   } else if (
//     this.forgotPasswordOtp &&
//     Date.now() - this.forgotPasswordOtpExpiresAt <= 60000
//   ) {
//     return (this.forgotPasswordOtpFlag = true);
//   }
// });
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
export { LoginOtpSchema };
*/