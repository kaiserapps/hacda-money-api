import * as express from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

@injectable()
export class LoggingMiddleware extends BaseMiddleware {

    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        console.log({
            request: {
                params: req.params,
                query: req.query
            }
        });
        next();
    }
}
