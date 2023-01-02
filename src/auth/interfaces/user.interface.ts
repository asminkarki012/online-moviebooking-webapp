export interface User {
  email:string;
  password?:string;
  roles:string[];
  otpExpiresAt?:any;
  otp?:Number;
  forgotPasswordOtp?:Number;
  forgotPasswordOtpExpiresAt?:any;
  active:Boolean;
  forgotPasswordOtpFlag?:Boolean;
}
