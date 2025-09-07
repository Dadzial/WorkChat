import  UserSchema  from '../schemas/user.schema';
import {IUser} from "../models/user.model";

class UserService {
    public async getAll() {
        try {
            return await UserSchema.find();
        } catch (error) {
            console.error('Error getting all users:', error);
            throw new Error('Error getting all users');
        }
    }

    public async createNewOrUpdate(user: IUser) {
        try {
            if (user.role) user.isAdmin = user.role === 'admin';

            if (!user._id) {
                const dataModel = new UserSchema(user);
                return await dataModel.save();
            } else {
                return await UserSchema.findByIdAndUpdate(user._id, { $set: user }, { new: true });
            }
        } catch (error) {
            console.error('Error creating or updating user:', error);
            throw new Error('Error creating or updating user');
        }
    }

    public async getByEmailOrName(login: string) {
        try {
            const result = await UserSchema.findOne({
                $or: [{ email: login }, { username: login }]
            });
            return result || null;
        } catch (error) {
            console.error('Error getting user by email or username:', error);
            throw new Error('Error getting user by email or username');
        }
    }



    public async remove(userId: string) {
        try {
            const result = await UserSchema.findByIdAndDelete(userId);
            if (result) {
                return result;
            }
        } catch (error) {
            console.error('Error removing user:', error);
            throw new Error('Error removing user');
        }
    }

    public async setActive(userId: string, status: boolean) {
        return UserSchema.findByIdAndUpdate(userId, { active: status }, { new: true });
    }
}

export default UserService;