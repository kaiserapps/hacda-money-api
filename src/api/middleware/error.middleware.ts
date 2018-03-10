import * as express from 'express';
import * as chalk from 'chalk';

export class ErrorMiddleware {
    static handler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        console.error(chalk.default.red(`Unexpected error: err`));
        res.status(500).json({error: err});
    }
}
