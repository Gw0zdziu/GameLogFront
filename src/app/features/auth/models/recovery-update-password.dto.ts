export interface RecoveryUpdatePasswordDto {
  userId: string;
  newPassword: string;
  confirmPassword: string;
  token: string;
}
