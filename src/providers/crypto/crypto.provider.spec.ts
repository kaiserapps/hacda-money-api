import * as crypto from 'crypto';
import * as TypeMoq from 'typemoq';
import { CryptoProvider } from './crypto.provider';
import { IEnvironment } from '../../environments/env.interface';

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
});
