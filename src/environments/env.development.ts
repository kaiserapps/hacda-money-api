import { IEnvironment } from './env.interface';

export const environment: IEnvironment = {
    allowHttp: true,
    keyFile: 'dev/testkeys/test.ssl.key',
    certFile: 'dev/testkeys/test.ssl.cert',
    url: 'localhost:3000',
    clientUrl: 'localhost:4200',
    useInMemoryDb: true,
    useLocalEmail: true,
    localEmailPath: 'test-email',
    sendGridTemplates: {
        accountManagement: '062dc554-7864-43f6-aeee-a3b0d319bd6e'
    },
    jwt: {
        privateKeyPath: 'dev/testkeys/test.ssl.key',
        publicKeyPath: 'dev/testkeys/test.ssl.cert',
    }
}
