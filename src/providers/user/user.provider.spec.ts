import * as TypeMoq from 'typemoq';
import { UserProvider } from './user.provider';
import { JwtPrincipal } from '../auth/jwt-principal';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('user provider', () => {

    describe('validate', () => {

        it('sets user', done => {
            // Arrange
            const userProv = new UserProvider();
            const principal = new JwtPrincipal('jwt');

            // Act
            userProv.validate(principal);

            // Assert
            expect(userProv.user).toBe(principal);
            done();
        });
    });
});
