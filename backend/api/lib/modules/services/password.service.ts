import bcrypt from 'bcrypt';
import PasswordSchema from "../schemas/password.schema";

class PasswordService {
    async authorize(userId: string, plainPassword: string): Promise<boolean> {
        try {
            const record = await PasswordSchema.findOne({ userId });
            if (!record) return false;


            const isMatch = await bcrypt.compare(plainPassword, record.password);
            return isMatch;
        } catch (error) {
            console.error(`Authorize Error: ${error.message}`);
            return false;
        }
    }


    async hashPassword(password: string): Promise<string> {
        try {
            const saltRounds = 10;
            return await bcrypt.hash(password, saltRounds);
        } catch (error) {
            console.error(`Hashing Error: ${error.message}`);
            throw new Error('Failed to hash password');
        }
    }


    async createOrUpdate({ userId, password }: { userId: string; password: string }): Promise<void> {
        try {
            const existing = await PasswordSchema.findOne({ userId });


            if (existing) {
                existing.password = password;
                await existing.save();
            } else {
                await PasswordSchema.create({ userId, password });
            }
        } catch (error) {
            console.error(`CreateOrUpdate Password Error: ${error.message}`);
            throw new Error('Failed to save password');
        }
    }
}


export default PasswordService;