import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { Role } from "src/auth/role.enum";
import { User } from "./user.schema";

export type LoginOtpDocument = LoginOtp & Document;

@Schema({
 timestamps:true 
})
export class LoginOtp {

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  userId:User;
  //email verification otp
  @Prop({type:Number})
  loginOtp: number;

  @Prop({ type:Number,default: Date.now() })
  loginOtpExpiresAt: number;

  // @Prop({ type:Boolean,default: false }) //when true user can login else cannot login
  // active: boolean;

}

const LoginOtpSchema = SchemaFactory.createForClass(LoginOtp);


export { LoginOtpSchema };
