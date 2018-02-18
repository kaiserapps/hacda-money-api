import * as express from 'express';
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, BaseHttpController } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc.types';

@controller('/foo')
export class FooController extends BaseHttpController implements interfaces.Controller {

    @httpGet('/')
    private index(req: express.Request, res: express.Response, next: express.NextFunction): string {
        // return this.fooService.get(req.query.id);
        return '';
    }

    @httpGet('/')
    private list(@queryParam('start') start: number, @queryParam('count') count: number): string {
        // return this.fooService.get(start, count);
        return '';
    }

    @httpPost('/')
    private async create(@request() req: express.Request, @response() res: express.Response) {
        try {
            // await this.fooService.create(req.body);
            res.sendStatus(201);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpDelete('/:id')
    private delete(@requestParam('id') id: string, @response() res: express.Response): Promise<void> {
        return Promise.resolve();
        // return this.fooService.delete(id)
        //     .then(() => res.sendStatus(204))
        //     .catch((err: Error) => {
        //         res.status(400).json({ error: err.message });
        //     });
    }
}
