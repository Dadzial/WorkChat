import Controller from "../interfaces/controller";
import {Router, Request, Response} from "express";
import path from "path";

class IndexController implements Controller {
    public path = '/';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.serveFrontend);
    }

    private serveFrontend(req: Request, res: Response) {
        res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    }
}
export default IndexController;