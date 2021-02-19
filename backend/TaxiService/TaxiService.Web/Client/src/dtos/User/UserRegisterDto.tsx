export default interface UserRegisterDto {
    Name: string;
    Email: string;
    EmailRe: string;
    Password: string;
    PasswordRe: string;
    AllowSpam: boolean;
}