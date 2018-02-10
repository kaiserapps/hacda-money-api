import 'reflect-metadata';
import * as bodyParser from 'body-parser';

import { Container } from 'inversify';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { CustomAuthProvider } from './api/middleware/custom-auth.provider';
import { LoggingMiddleware } from './api/middleware/logging.middleware';
import { AuthService } from './service/auth.service';
import { TYPES } from './ioc-types';

// declare metadata by @controller annotation
import './api/controllers/foo.controller';

// set up container
let container = new Container();

// set up bindings
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inRequestScope();
container.bind<LoggingMiddleware>(TYPES.LoggingMiddleware).to(LoggingMiddleware);

// create server
const server = new InversifyExpressServer(
    container, null, null, null, CustomAuthProvider
);
server.setConfig((app) => {
    // add body parser
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
});

let app = server.build();
app.listen(3000);
