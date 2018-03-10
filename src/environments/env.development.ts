import { IEnvironment } from './env.interface';

export const environment: IEnvironment = {
    url: 'http://localhost:3000',
    clientUrl: 'http://localhost:4200',
    useInMemoryDb: true,
    useLocalEmail: true,
    localEmailPath: 'test-email',
    sendGridTemplates: {
        accountManagement: '062dc554-7864-43f6-aeee-a3b0d319bd6e'
    },
    jwt: {
        privateKeyPath: '/home/evan/.ssh/jwt_rsa',
        publicKeyPath: '/home/evan/.ssh/jwt_rsa.pub'
    }
}
