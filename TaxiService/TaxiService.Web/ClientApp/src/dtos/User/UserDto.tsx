export default interface UserDto {
    token: string;
    email: string;
    userId: string;
    name: string;
    address: string;
    role: string;
}

export const UserRoles = {
    User: "User",
    Administrator: "Adminsitrator",
    Worker: "Worker"
}