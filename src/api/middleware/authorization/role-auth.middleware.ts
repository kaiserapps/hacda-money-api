import * as express from 'express';
import { injectable, unmanaged } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

import { RoleType } from '../../../domain/user/enums';

@injectable()
export abstract class RoleAuthMiddleware extends BaseMiddleware {
    constructor(
        @unmanaged() private rolesAuthorized: RoleType[]
    ) {
        super();
    }

    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const promises: Array<Promise<boolean>> = [];
        for (const r of this.rolesAuthorized) {
            promises.push(this.httpContext.user.isInRole(r.toString()));
        }

        this.httpContext.user.isAuthenticated()
            .then(isAuthed =>
                isAuthed ?
                Promise.all(promises) :
                Promise.reject(null))
            .then(rolesMatched => rolesMatched.some(x => x) ? next() : res.sendStatus(403))
            .catch(err => res.status(500).json({ error: err }));
    }
}
