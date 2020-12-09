export default interface ChangePasswordDto {
    OldPassword: string;
    NewPassword: string;
    NewPasswordConfirm: string;
}