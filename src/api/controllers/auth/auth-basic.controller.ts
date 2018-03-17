import * as auth from 'basic-auth';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, interfaces, request, requestParam, response } from 'inversify-express-utils';

import { IEnvironment } from '../../../environments/env.interface';
import { TYPES } from '../../../ioc.types';
import { AuthStrategy } from '../../../providers/auth/enums';
import { ICryptoProvider } from '../../../providers/crypto/crypto.provider.interface';
import { IAuthService } from '../../../service/auth/auth.service.interface';
import { UserResponse } from '../../../service/user/user-response';
import { IUserService } from '../../../service/user/user.service.interface';

@controller('/auth/basic')
export class AuthBasicController implements interfaces.Controller {
    private _jwtSettings: any;
    constructor(
        @inject(TYPES.Environment) private environment: IEnvironment,
        @inject(TYPES.AuthService) private authService: IAuthService,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.CryptoProvider) private cryptoProvider: ICryptoProvider
    ) {
        this._jwtSettings = environment.jwt || {};
    }

    @httpGet('/login')
    public async login(
        @request() req: express.Request,
        @response() res: express.Response
    ) {
        const credentials = auth(req);
        if (credentials) {
            return await this.userService.findUser(AuthStrategy.Basic, credentials.name).then(user => {
                if (user && user.password.verify(this.cryptoProvider, credentials.pass)) {
                    return this.authService.login(user);
                }
                else {
                    return Promise.reject('User credentials invalid.');
                }
            }).then(token => {
                return {
                    jwt: token
                };
            }).catch(err => this.sendBasicAuthChallenge(res, err));
        }
        else {
            this.sendBasicAuthChallenge(res, 'User credentials not provided.');
        }
    }

    @httpPost('/register')
    public register(
        @request() req: express.Request,
        @response() res: express.Response
    ): Promise<UserResponse> {
        return this.userService.registerBasicUser(AuthStrategy.Basic, req.body.email, req.body.displayName, req.protocol);
    }

    @httpPost('/forgotpass')
    public forgotpass(
        @request() req: express.Request,
        @response() res: express.Response
    ): any {
        return this.userService.forgotPass(AuthStrategy.Basic, req.body.email, req.protocol);
    }

    @httpPost('/resetpass/:token')
    public resetpass(
        @requestParam('token') token: string,
        @request() req: express.Request,
        @response() res: express.Response
    ): any {
        return this.userService.resetPass(AuthStrategy.Basic, req.body.email, token, req.body.password);
    }

    private sendBasicAuthChallenge(res: express.Response, error: string) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).json({ error: error });
    }
}
