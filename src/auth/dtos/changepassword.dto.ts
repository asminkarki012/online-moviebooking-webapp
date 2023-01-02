export class ChangePasswordDto {
  readonly email?: string;
  readonly oldpassword: string;
  newpassword: string;
  confirmpassword: string;
}
