import express from 'express';
import * as http from 'http';
import {CommonRoutesConfig} from './routes/commonRoutesConfig';
import {CardRoutes} from './routes/cardRoutesConfig';
import {ColumnRoutes} from './routes/columnRoutesConfig';
import debug from 'debug';
import mongoose from "mongoose";
import * as dotenv from 'dotenv';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = parseInt(process.env.PORT || "8080");
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
routes.push(new CardRoutes(app));
routes.push(new ColumnRoutes(app));

dotenv.config();

function dbUri() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI env var is not set, cannot connect to DB");
    }
    return process.env.MONGODB_URI;
}
mongoose
    .connect(dbUri(), {useNewUrlParser: true})
    .then(debug("...connected to db"));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection error"));

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('Server up and running!')
});

server.listen(port, () => {
    debugLog('Server listening on port ' + port);
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
});
