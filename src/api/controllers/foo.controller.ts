import * as express from 'express';
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, BaseHttpController } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc.types';

@controller('/foo')
export class FooController extends BaseHttpController implements interfaces.Controller {

    @httpGet('/:id', TYPES.LoggingMiddleware)
    private index(@requestParam('id') id: string): any {
        return {
            user: this.httpContext.user.details,
            id: id
        };
    }

    @httpGet('/', TYPES.LoggingMiddleware)
    private list(@queryParam('start') start: number, @queryParam('count') count: number): any {
        return {
            user: this.httpContext.user.details,
            start: start,
            count: count
        };
    }
}
