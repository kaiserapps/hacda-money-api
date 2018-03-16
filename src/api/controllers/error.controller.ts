import * as express from 'express';
import { controller, httpGet, interfaces, request, requestParam, response } from 'inversify-express-utils';

@controller('/error')
export class ErrorController implements interfaces.Controller {
    @httpGet('/:err')
    public index(
        @requestParam('err') err: string,
        @request() req: express.Request,
        @response() res: express.Response
    ) {
        res.sendStatus(500).json({ error: err });
    }
}
