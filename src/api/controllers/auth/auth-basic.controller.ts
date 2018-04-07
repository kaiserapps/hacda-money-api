import * as auth from 'basic-auth';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, interfaces, httpGet, httpPost, request, requestParam, response } from 'inversify-express-utils';

import { IEnvironment } from '../../../environments/env.interface';
import { TYPES } from '../../../ioc.types';
import { AuthStrategy } from '../../../providers/auth/enums';
import { ICryptoProvider } from '../../../providers/crypto/crypto.provider.interface';
import { IAuthService } from '../../../service/auth/auth.service.interface';
import { UserResponse } from '../../../service/user/user-response';
import { IUserService } from '../../../service/user/user.service.interface';
import { BasicUserService } from '../../../service/user/basic-user.service';
import { IUserPasswordService } from '../../../service/user/user-password.service.interface';

@controller('/auth/basic')
export class AuthBasicController implements interfaces.Controller {
    private _jwtSettings: any;
    private _userService: IUserService;
    constructor(
        @inject(TYPES.Environment) private environment: IEnvironment,
        @inject(TYPES.AuthService) private authService: IAuthService,
        @inject(TYPES.UserService) private userServiceFactory: (authStrategy: AuthStrategy) => IUserService,
        @inject(TYPES.UserPasswordService) private passwordService: IUserPasswordService,
        @inject(TYPES.CryptoProvider) private cryptoProvider: ICryptoProvider
    ) {
        this._jwtSettings = environment.jwt || {};
        this._userService = userServiceFactory(AuthStrategy.Basic);
    }

    @httpGet('/login')
    async login(
        @request() req: express.Request,
        @response() res: express.Response
    ) {
        const credentials = auth(req);
        if (!credentials) {
            this.sendBasicAuthChallenge(res, 'User credentials not provided.');
            return;
        }

        try {
            const user = await this._userService.findUser(AuthStrategy.Basic, credentials.name);
            let token: string;
            if (user && user.password.verify(this.cryptoProvider, credentials.pass)) {
                token = await this.authService.login(user);
            }
            else {
                throw new Error('User credentials invalid.');
            }

            return {
                jwt: token
            };
        }
        catch (err) {
            this.sendBasicAuthChallenge(res, err);
            return;
        }
    }

    @httpPost('/register')
    async register(
        @request() req: express.Request,
        @response() res: express.Response
    ): Promise<UserResponse> {
        this.passwordService.httpProtocol = req.protocol;
        return this._userService.registerUser(AuthStrategy.Basic, req.body.email, req.body.displayName);
    }

    @httpPost('/forgotpass')
    async forgotpass(
        @request() req: express.Request,
        @response() res: express.Response
    ): Promise<string> {
        this.passwordService.httpProtocol = req.protocol;
        return this._userService.forgotPass(AuthStrategy.Basic, req.body.email, req.protocol);
    }

    @httpPost('/resetpass/:token')
    async resetpass(
        @requestParam('token') token: string,
        @request() req: express.Request,
        @response() res: express.Response
    ): Promise<void> {
        return this._userService.resetPass(AuthStrategy.Basic, req.body.email, token, req.body.password);
    }

    private sendBasicAuthChallenge(res: express.Response, error: string) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).json({ error: error });
    }
}
