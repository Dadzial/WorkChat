import express from "express";
import {config} from "./config";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import Controller from "./interfaces/controller";
import path from "path";

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeStaticFiles();
        this.connectToDatabase();
    }

    private initializeMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));
    }

    private initializeStaticFiles() {
        const frontendPath = path.join(__dirname, '../../../frontend/dist/frontend/browser');
        this.app.use(express.static(frontendPath));

        this.app.get('/', (req, res) => {
            res.sendFile(path.join(frontendPath, 'index.html'));
        });
    }

    private async connectToDatabase(): Promise<void> {
        try {
            await mongoose.connect(config.databaseUrl);
            console.log('Connection with database established');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }

        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });
    }


    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    }
}
export default App;