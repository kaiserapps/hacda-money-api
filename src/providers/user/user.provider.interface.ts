import { JwtPrincipal } from '../auth/jwt-principal';

export interface IUserProvider {
    user: JwtPrincipal;
    validate(user: JwtPrincipal): void;
    invalidate(): void;
}
