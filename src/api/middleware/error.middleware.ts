import * as express from 'express';
import * as chalk from 'chalk';

export class ErrorMiddleware {
    static handler(err: Error | string, req: express.Request, res: express.Response, next: express.NextFunction) {
        if (typeof err === 'string') {
            err = new Error(err);
        }
        console.error(chalk.default.red(`Unexpected error: ${err.message}`));
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
}
