import { IEnvironment } from './env.interface';

export const environment: IEnvironment = {
    useInMemoryDb: true,
    jwt: {
        privateKeyPath: '/home/evan/.ssh/jwt_rsa',
        publicKeyPath: '/home/evan/.ssh/jwt_rsa.pub'
    }
}
