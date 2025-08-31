import Controller from "../interfaces/controller";
import {Router} from "express";

class IndexController implements Controller {
    public path = '/*';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.get(this.path, this.renderIndex);
    }
}
export default IndexController;