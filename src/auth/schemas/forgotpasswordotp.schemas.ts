import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { User } from "./user.schema";

export type ForgotPasswordOtpDocument = ForgotPasswordOtp & Document;

@Schema({
  timestamps: true,
})
export class ForgotPasswordOtp {
  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  userId: User;

  //forgotpassword otp
  @Prop({type:Number})
  forgotPasswordOtp: number;

  @Prop({type:Number})
  forgotPasswordOtpExpiresAt: number;
  // @Prop({default:false})
  @Prop({type:Boolean})
  forgotPasswordOtpFlag: boolean;
}

export const ForgotPasswordOtpSchema =
  SchemaFactory.createForClass(ForgotPasswordOtp);
