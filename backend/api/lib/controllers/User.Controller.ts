import Controller from "../interfaces/controller";
import {Request, Response, NextFunction, Router} from 'express';
import Joi from 'joi';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import {auth} from "../middlewares/auth.middleware";
import {admin} from "../middlewares/admin.middleware";
import logger from "../utils/logger";

class UserController implements Controller {
    path = '/api/user'
    router = Router();
    private userService = new UserService();
    private passwordService = new PasswordService();
    private tokenService = new TokenService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/get/all` , admin , this.getAllUsers)
        this.router.get(`${this.path}/all/status`  ,this.getAllUsersStatus)
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.post(`${this.path}/create`, admin , this.createNewOrUpdate);
        this.router.delete(`${this.path}/logout/:userId`, auth , this.removeHashSession);
        this.router.delete(`${this.path}/delete/:userId`, admin , this.removeUser);
        this.router.delete(`${this.path}/tokens/clear`,admin ,this.clearTokens)
    }

    private getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAll();
            logger.info(`Fetched all users, count=${users.length}`);
            response.status(200).json(users);
        } catch (error: any) {
            logger.error(`GetAllUsers Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }
    }

    private getAllUsersStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allUsers = await this.userService.getAll();
            const onlineUsers = allUsers.filter(u => u.active);
            const offlineUsers = allUsers.filter(u => !u.active);

            res.status(200).json({
                online: onlineUsers,
                offline: offlineUsers
            });
        } catch (error: any) {
            logger.error(`GetAllUsersStatus Error: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
        const schema = Joi.object({
            login: Joi.string().min(3).required(),
            password: Joi.string().min(6).required(),
        });

        const { error, value } = schema.validate(request.body);
        if (error) {
            logger.warn(`Auth validation failed: ${error.message}`);
            return response.status(400).json({ error: 'Validation failed', details: error.details });
        }

        const { login, password } = value;
        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                logger.warn(`Auth failed: user ${login} not found`);
                return response.status(404).json({ error: 'User not found' });
            }

            const isAuthorized = await this.passwordService.authorize(user._id, password);
            if (!isAuthorized) {
                logger.warn(`Auth failed: invalid credentials for ${login}`);
                return response.status(401).json({ error: 'Invalid credentials' });
            }
            await this.userService.setActive(user._id, true);

            const token = await this.tokenService.create(user);
            logger.info(`User ${user._id} authenticated successfully`);
            return response.status(200).json(this.tokenService.getToken(token));

        } catch (error: any) {
            logger.error(`Auth Error: ${error.message}`);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            username: Joi.string().min(3).required(),
            password: Joi.string().min(6).optional(),
            role: Joi.string().valid('user', 'admin').default('user'),
        });

        const { error, value } = schema.validate(request.body);
        if (error) {
            logger.warn(`User create/update validation failed: ${error.message}`);
            return response.status(400).json({ error: 'Validation failed', details: error.details });
        }

        try {
            const user = await this.userService.createNewOrUpdate(value);
            if (value.password) {
                const hashedPassword = await this.passwordService.hashPassword(value.password)
                await this.passwordService.createOrUpdate({
                    userId: user._id,
                    password: hashedPassword
                });
            }
            logger.info(`User created/updated: ${user._id}`);
            response.status(201).json(user);
        } catch (error: any) {
            logger.error(`Create/Update User Error: ${error.message}`);
            response.status(500).json({error: 'Internal server error'});
        }
    };

    private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
        const schema = Joi.object({
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        });

        const { error, value } = schema.validate(request.params);
        if (error) {
            logger.warn(`Remove session validation failed: ${error.message}`);
            return response.status(400).json({ error: 'Validation failed', details: error.details });
        }

        try {
            const result = await this.tokenService.remove(value.userId);
            if (!result) {
                logger.warn(`Session not found for userId=${value.userId}`);
                return response.status(404).json({ error: 'Session not found' });
            }
            await this.userService.setActive(value.userId, false);
            logger.info(`Session removed for userId=${value.userId}`);
            response.status(200).json(result);
        } catch (error: any) {
            logger.error(`Remove session error: ${error.message}`);
            response.status(500).json({error: 'Internal server error'});
        }
    };

    private removeUser = async (request: Request, response: Response, next: NextFunction) => {
        const schema = Joi.object({
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        });

        const { error, value } = schema.validate(request.params);
        if (error) {
            logger.warn(`Remove user validation failed: ${error.message}`);
            return response.status(400).json({ error: 'Validation failed', details: error.details });
        }

        try {
            const result = await this.userService.remove(value.userId);
            if (!result) {
                logger.warn(`User not found with id=${value.userId}`);
                return response.status(404).json({ error: 'User not found' });
            }
            logger.info(`User removed: ${value.userId}`);
            response.status(200).json(result);
        } catch (error: any) {
            logger.error(`Remove user error: ${error.message}`);
            response.status(500).json({error: 'Internal server error'});
        }
    };

    private clearTokens = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const result = await this.tokenService.clear();
            logger.info(`Tokens cleared`);
            response.status(200).json(result);
        } catch (error: any) {
            logger.error(`Clear tokens error: ${error.message}`);
            response.status(500).json({error: 'Internal server error'});
        }
    }
}

export default UserController;
