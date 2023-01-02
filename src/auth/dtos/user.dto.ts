export class RegisterUserDto {
  readonly email:string;
  password:string ;
  roles:string[];
  active:Boolean;
  forgotPasswordOtpFlag?:Boolean;

}

export class LoginUserDto{
  readonly email:string;
  readonly password:string;
}