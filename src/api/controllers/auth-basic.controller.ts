import * as auth from 'basic-auth';
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
    httpGet,
} from 'inversify-express-utils';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { IAuthService } from '../../service/auth/auth.service.interface';
import { UserResponse } from '../../service/user/user-response';
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

    @httpGet('/login')
    public login(@request() req: express.Request, @response() res: express.Response) {
        const credentials = auth(req);
        if (credentials) {
            this.userService.findUser(credentials.name).then(user => {
                if (user && user.password.verify(credentials.pass)) {
                    this.authService.login(user).then(token => {
                        res.cookie(this.jwt.cookieName, token, {
                            maxAge: this.jwt.tokenExpiration * 1000
                        });
                    }).catch(() => this.sendBasicAuthChallenge(res));
                }
                else {
                    this.sendBasicAuthChallenge(res);
                }
            }).catch(() => this.sendBasicAuthChallenge(res));
        }
        else {
            this.sendBasicAuthChallenge(res);
        }
    }

    @httpPost('/register')
    public register(@request() req: express.Request, @response() res: express.Response): Promise<UserResponse> {
        return this.userService.registerUser(req.body.strategy, req.body.email, req.body.familyName, req.body.givenName, req.body.oAuthData);
    }

    @httpPost('/forgotpass')
    public forgotpass(@request() req: express.Request, @response() res: express.Response): any {
        return this.userService.forgotPass(req.body.email);
    }

    @httpPost('/resetpass/:token')
    public resetpass(@requestParam('token') token: string, @request() req: express.Request, @response() res: express.Response): any {
        return this.userService.resetPass(req.body.email, token, req.body.password);
    }

    private sendBasicAuthChallenge(res: express.Response) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.sendStatus(401);
    }
}
