import { IEnvironment } from './env.interface';

export const environment: IEnvironment = {
    connectionString: 'mongodb://localhost/HACDA',
    emailFrom: 'noreply@harrisburgcontra.org',
    jwt: {
        audiences: ['hacda-money-api'],
        audience: 'hacda-money-api',
        issuer: 'hacda-money-api'
    }
}
