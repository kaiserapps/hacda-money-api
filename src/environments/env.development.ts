import { IEnvironment } from './env.interface';

export const environment: IEnvironment = {
    keyFile: '/home/evan/.ssl/key.pem',
    certFile: '/home/evan/.ssl/key.crt',
    url: 'https://localhost:3000',
    clientUrl: 'https://localhost:4200',
    useInMemoryDb: true,
    useLocalEmail: true,
    localEmailPath: 'test-email',
    sendGridTemplates: {
        accountManagement: '062dc554-7864-43f6-aeee-a3b0d319bd6e'
    },
    jwt: {
        privateKeyPath: '/home/evan/.ssl/key.pem',
        publicKeyPath: '/home/evan/.ssl/key.crt',
    }
}
