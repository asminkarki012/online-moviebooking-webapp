export class RegisterUserDto {
  readonly email: string;
  password: string;
  confirmPassword:string;
  roles: string[];
  readonly active: Boolean;
  forgotPasswordOtpFlag?: Boolean;
}

export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}
