import * as express from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

@injectable()
export class AuthorizeMiddleware extends BaseMiddleware {
    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        this.httpContext.user.isAuthenticated()
            .then(isAuthed => isAuthed ? next() : res.sendStatus(401))
            .catch(err => res.status(500).json({ error: err }));
    }
}
