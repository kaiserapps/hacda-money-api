import * as express from 'express';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpPost,
    interfaces,
    request,
    requestParam,
    response,
} from 'inversify-express-utils';

import { User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { IAuthService } from '../../service/auth/auth.service.interface';
import { IUserService } from '../../service/user/user.service.interface';

@controller('/auth/basic')
export class AuthBasicController extends BaseHttpController implements interfaces.Controller {
    jwt: any;
    constructor(
        @inject(TYPES.Environment) private environment: IEnvironment,
        @inject(TYPES.AuthService) private authService: IAuthService,
        @inject(TYPES.UserService) private userService: IUserService
    ) {
        super();
        this.jwt = environment.jwt || {};
    }

    @httpPost('/login', TYPES.LoggingMiddleware)
    public login(@request() req: express.Request, @response() res: express.Response) {
        this.userService.findUser(req.body.email).then(user => {
            if (user.password.verify(req.body.password)) {
                this.authService.login(user).then(token => {
                    res.cookie(this.jwt.cookieName, token, {
                        maxAge: this.jwt.tokenExpiration * 1000
                    });
                });
            }
            else {
                res.sendStatus(401);
            }
        });
    }

    @httpPost('/register', TYPES.LoggingMiddleware)
    public register(@request() req: express.Request, @response() res: express.Response): Promise<User> {
        return this.userService.registerUser(req.body.strategy, req.body.email, req.body.familyName, req.body.givenName, req.body.oAuthData);
    }

    @httpPost('/forgotpass', TYPES.LoggingMiddleware)
    public forgotpass(@request() req: express.Request, @response() res: express.Response): any {
        return this.userService.forgotPass(req.body.email);
    }

    @httpPost('/resetpass/:token', TYPES.LoggingMiddleware)
    public resetpass(@requestParam('token') token: string, @request() req: express.Request, @response() res: express.Response): any {
        return this.userService.resetPass(req.body.email, token, req.body.password);
    }
}