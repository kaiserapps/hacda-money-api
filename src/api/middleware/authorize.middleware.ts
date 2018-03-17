import * as express from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

import { User } from '../../domain/user/user';
import { TYPES } from '../../ioc.types';
import { IUserProvider } from '../../providers/user/user.provider.interface';

@injectable()
export class AuthorizeMiddleware extends BaseMiddleware {
    @inject(TYPES.UserProvider) private readonly _userProvider: IUserProvider;
    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (this._userProvider.user) {
            next();
        }
        else {
            res.sendStatus(401);
        }
    }
}
