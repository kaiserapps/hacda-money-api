import { IEnvironment } from './env.interface';

export const environment: IEnvironment = {
    connectionString: 'mongodb://localhost/HACDA',
    jwt: {
        audiences: ['hacda-money-api'],
        issuer: 'hacda-money-api'
    }
}
