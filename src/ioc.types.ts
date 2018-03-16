export const TYPES = {
    // consts/static
    Environment: Symbol('Environment'),
    InMemoryDb: Symbol('InMemoryDb'),
    // app/middleware
    FacebookAuthMiddleware: Symbol('FacebookAuthMiddleware'),
    GoogleAuthMiddleware: Symbol('GoogleAuthMiddleware'),
    OAuthSuccessMiddleware: Symbol('OAuthSuccessMiddleware'),
    // providers
    CryptoProvider: Symbol('CryptoProvider'),
    DateProvider: Symbol('DateProvider'),
    EmailProvider: Symbol('EmailProvider'),
    // repositories
    UserRepository: Symbol('UserRepository'),
    // services
    AuthService: Symbol('AuthService'),
    UserService: Symbol('UserService'),
}
