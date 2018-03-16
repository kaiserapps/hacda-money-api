// declares metadata by @controller annotation (must be first)
import './api/controllers/_import-controllers';

import * as fs from 'fs';
import * as chalk from 'chalk';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';

import { ContainerConfig } from './api/config/container.config';
import { EnvironmentConfig } from './api/config/environment.config';
import { ExpressConfig } from './api/config/express.config';
import { MongooseConfig } from './api/config/mongoose.config';

// Configure API
const settings = EnvironmentConfig.Configure(process.env, path.join(__dirname, 'environments'));
const container = ContainerConfig.Configure(settings, __dirname);
MongooseConfig.SetupSchemas();

// create Express server
const app = ExpressConfig.Configure(container, __dirname).build();

let httpServ: http.Server;
if (settings.allowHttp) {
    httpServ = http.createServer(app);
}
const httpsServ = https.createServer({
    key: fs.readFileSync(settings.keyFile || ''),
    cert: fs.readFileSync(settings.certFile || '')
}, app);

MongooseConfig.Connect(settings).then(() => {
    if (settings.allowHttp) {
        try {
            httpServ.listen(settings.httpPort);
        }
        catch (err) {
            console.error(chalk.default.red(err));
            console.error(chalk.default.red(`Failed to listen on http port ${settings.httpPort}. Set 'httpPort' on the environment file to run on a different port.`));
            process.exit(1);
        }
    }

    try {
        httpsServ.listen(settings.httpsPort);
    }
    catch (err) {
        console.error(chalk.default.red(err));
        console.error(chalk.default.red(`Failed to listen on https port ${settings.httpsPort}. Set 'httpsPort' on the environment file to run on a different port.`));
        process.exit(1);
    }

    console.log(chalk.default.green(`REST API server started on: HTTPS (${settings.httpsPort})${settings.allowHttp ? ` and HTTP (${settings.httpPort})` : ''}`));
}).catch(() => {
    console.warn(chalk.default.yellow('Failed to connect to MongooseDB. Retrying...'));
    setTimeout(() => MongooseConfig.Connect(settings), 5000);
});
