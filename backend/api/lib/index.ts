import App from "./app";
import IndexController from "./controllers/Index.Controller";
import UserController from "./controllers/User.Controller";

const app = new App([]);


app.app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});


const controllers = [
    new UserController(),
    new IndexController()
];

controllers.forEach((controller) => {
    app.app.use("/", controller.router);
});

app.listen();