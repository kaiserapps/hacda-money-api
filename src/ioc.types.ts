export const TYPES = {
    // consts/static
    Environment: Symbol('Environment'),
    InMemoryDb: Symbol('InMemoryDb'),
    // app/middleware
    AuthorizeMiddleware: Symbol('AuthorizeMiddleware'),
    FacebookAuthMiddleware: Symbol('FacebookAuthMiddleware'),
    GithubAuthMiddleware: Symbol('GithubAuthMiddleware'),
    GoogleAuthMiddleware: Symbol('GoogleAuthMiddleware'),
    OAuthSuccessMiddleware: Symbol('OAuthSuccessMiddleware'),
    // providers
    CryptoProvider: Symbol('CryptoProvider'),
    DateProvider: Symbol('DateProvider'),
    EmailProvider: Symbol('EmailProvider'),
    UserProvider: Symbol('UserProvider'),
    // repositories
    AuditRepository: Symbol('AuditRepository'),
    UserRepository: Symbol('UserRepository'),
    // services
    AuthService: Symbol('AuthService'),
    UserService: Symbol('UserService'),
}
