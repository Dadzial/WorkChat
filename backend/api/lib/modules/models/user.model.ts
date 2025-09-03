export interface IUser {
    _id: string;
    email: string;
    username: string;
    role?: string;
    active?: boolean;
    isAdmin?: boolean;
}
