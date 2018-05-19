import * as crypto from 'crypto';
import * as TypeMoq from 'typemoq';

import { IEnvironment } from '../../environments/env.interface';
import { CryptoProvider } from './crypto.provider';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('crypto provider', () => {

    describe('hash password', () => {

        it('uses randomly generated hex salt to hash password', () => {
            // Arrange
            spyOn(crypto, 'randomBytes').and.returnValue(new Buffer('salt'));
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', ['update', 'digest']);
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const hashed = cryptoProv.hashPassword('pass');

            // Assert
            expect(hashSpy).toHaveBeenCalledWith('sha512', new Buffer('salt').toString('hex'));
        });

        it('uses alternative algorithm', () => {
            // Arrange
            spyOn(crypto, 'randomBytes').and.returnValue(new Buffer('salt'));
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', ['update', 'digest']);
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const hashed = cryptoProv.hashPassword('pass', 'sha256');

            // Assert
            expect(hashSpy).toHaveBeenCalledWith('sha256', new Buffer('salt').toString('hex'));
        });

        it('updates hmac with password', () => {
            // Arrange
            spyOn(crypto, 'randomBytes').and.returnValue(new Buffer('salt'));
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', ['update', 'digest']);
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const hashed = cryptoProv.hashPassword('pass');

            // Assert
            expect(hmacSpy.update).toHaveBeenCalledWith('pass');
        });

        it('returns salt and hashed password', () => {
            // Arrange
            spyOn(crypto, 'randomBytes').and.returnValue(new Buffer('salt'));
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', {
                update: undefined,
                digest: 'hashed'
            });
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const hashed = cryptoProv.hashPassword('pass');

            // Assert
            expect(hashed.hash).toBe('hashed');
            expect(hashed.salt).toBe(new Buffer('salt').toString('hex'));
        });
    });

    describe('verify password', () => {

        it('creates hmac', () => {
            // Arrange
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', ['update', 'digest']);
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const hashed = cryptoProv.verifyPassword('pass', {
                hash: 'hashed',
                salt: 'salt'
            });

            // Assert
            expect(hashSpy).toHaveBeenCalledWith('sha512', 'salt');
        });

        it('creates hmac with alternative algorithm', () => {
            // Arrange
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', ['update', 'digest']);
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const hashed = cryptoProv.verifyPassword('pass', {
                hash: 'hashed',
                salt: 'salt'
            }, 'sha256');

            // Assert
            expect(hashSpy).toHaveBeenCalledWith('sha256', 'salt');
        });

        it('updates hmac with password', () => {
            // Arrange
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', ['update', 'digest']);
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const hashed = cryptoProv.verifyPassword('pass', {
                hash: 'hashed',
                salt: 'salt'
            });

            // Assert
            expect(hmacSpy.update).toHaveBeenCalledWith('pass');
        });

        it('updates hmac with password', () => {
            // Arrange
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', ['update', 'digest']);
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const hashed = cryptoProv.verifyPassword('pass', {
                hash: 'hashed',
                salt: 'salt'
            });

            // Assert
            expect(hmacSpy.update).toHaveBeenCalledWith('pass');
        });

        it('returns true if password matched', () => {
            // Arrange
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', {
                update: undefined,
                digest: 'hashed'
            });
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const matched = cryptoProv.verifyPassword('pass', {
                hash: 'hashed',
                salt: 'salt'
            });

            // Assert
            expect(matched).toBeTruthy();
        });

        it('returns false if password wrong', () => {
            // Arrange
            const hmacSpy = jasmine.createSpyObj<crypto.Hmac>('crypto.Hmac', {
                update: undefined,
                digest: 'hashed'
            });
            const hashSpy = spyOn(crypto, 'createHmac').and.returnValue(hmacSpy);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const matched = cryptoProv.verifyPassword('pass', {
                hash: 'not expected hash',
                salt: 'salt'
            });

            // Assert
            expect(matched).toBeFalsy();
        });
    });

    describe('encrypt string', () => {

        it('creates cipher', () => {
            // Arrange
            const cipherMock = Mock.ofType<crypto.Cipher>();
            const cipherSpy = spyOn(crypto, 'createCipher').and.returnValue(cipherMock.object);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            cryptoProv.encrypt('plaintext');

            // Assert
            expect(cipherSpy).toHaveBeenCalled();
        });

        it('updates plaintext using cipher', () => {
            // Arrange
            const cipherMock = Mock.ofType<crypto.Cipher>();
            cipherMock.setup(x => x.update(It.isAnyString(), 'utf8', 'base64')).returns(() => 'encrypted').verifiable();
            cipherMock.setup(x => x.final('base64')).returns(() => ' value').verifiable();
            const cipherSpy = spyOn(crypto, 'createCipher').and.returnValue(cipherMock.object);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const result = cryptoProv.encrypt('plaintext');

            // Assert
            cipherMock.verify(x => x.update('plaintext', 'utf8', 'base64'), Times.once());
            cipherMock.verify(x => x.final('base64'), Times.once());
            expect(result).toBe('encrypted value');
        });
    });

    describe('decrypt string', () => {

        it('creates decipher', () => {
            // Arrange
            const cipherMock = Mock.ofType<crypto.Decipher>();
            const cipherSpy = spyOn(crypto, 'createDecipher').and.returnValue(cipherMock.object);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            cryptoProv.decrypt('encrypted value');

            // Assert
            expect(cipherSpy).toHaveBeenCalled();
        });

        it('updates encrypted value using decipher', () => {
            // Arrange
            const decipherMock = Mock.ofType<crypto.Decipher>();
            decipherMock.setup(x => x.update(It.isAnyString(), 'base64', 'utf8')).returns(() => 'plain').verifiable();
            decipherMock.setup(x => x.final('utf8')).returns(() => 'text').verifiable();
            const cipherSpy = spyOn(crypto, 'createDecipher').and.returnValue(decipherMock.object);

            // Act
            const cryptoProv = new CryptoProvider(Mock.ofType<IEnvironment>().object);
            const result = cryptoProv.decrypt('encrypted value');

            // Assert
            decipherMock.verify(x => x.update('encrypted value', 'base64', 'utf8'), Times.once());
            decipherMock.verify(x => x.final('utf8'), Times.once());
            expect(result).toBe('plaintext');
        });
    });
});
