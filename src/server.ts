// declares metadata by @controller annotation (must be first)
import './api/controllers/_import-controllers';

import * as chalk from 'chalk';
import * as path from 'path';

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

MongooseConfig.Connect(settings).then(() => {
    try {
        app.listen(settings.port);
    }
    catch (err) {
        console.error(chalk.default.red(`Failed to listen on port ${settings.port}. Set the environment variable PORT to run on a different port.`));
    }

    console.log(chalk.default.green(`REST API server started on: ${settings.port}`));
}).catch(() => {
    console.warn(chalk.default.yellow('Failed to connect to MongooseDB. Retrying...'));
    setTimeout(() => MongooseConfig.Connect(settings), 5000);
});
