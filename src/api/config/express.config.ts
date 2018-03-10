import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as morgan from 'morgan';
import * as path from 'path';

import { ErrorMiddleware } from '../../api/middleware/error.middleware';
import { JwtAuthProvider } from '../../api/middleware/jwt-auth.provider';

export class ExpressConfig {
    static Configure(container: Container, logDirectory: string) {
        const server = new InversifyExpressServer(
            container, null, null, null, JwtAuthProvider
        );
        server.setConfig(a => {
            a
            // add body parser
            .use(bodyParser.urlencoded({
                extended: true
            }))
            // default body to JSON
            .use(bodyParser.json())
            // add console logging for just errors
            .use(morgan('dev', {
                skip: (req, res) => res.statusCode < 400
            }))
            // add logging for all statuses to a file
            .use(morgan('common', {
                stream: fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' })
            }));
        });
        server.setErrorConfig(a => {
            a
            // add catch-all error handling
            .use(ErrorMiddleware.handler);
        });
        return server;
    }
}
