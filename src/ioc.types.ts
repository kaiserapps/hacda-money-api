export const TYPES = {
    // consts/static
    Environment: Symbol('Environment'),
    InMemoryDb: Symbol('InMemoryDb'),
    // middleware
    LoggingMiddleware: Symbol('LoggingMiddleware'),
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