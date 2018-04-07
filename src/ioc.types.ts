export const TYPES = {
    // consts/static
    Environment: Symbol('Environment'),
    InMemoryDb: Symbol('InMemoryDb'),
    // app/middleware
    AdminAuthMiddleware: Symbol('AdminAuthMiddleware'),
    AuditAuthMiddleware: Symbol('AuditAuthMiddleware'),
    AuthorizeMiddleware: Symbol('AuthorizeMiddleware'),
    FacebookAuthMiddleware: Symbol('FacebookAuthMiddleware'),
    GithubAuthMiddleware: Symbol('GithubAuthMiddleware'),
    GoogleAuthMiddleware: Symbol('GoogleAuthMiddleware'),
    OAuthSuccessMiddleware: Symbol('OAuthSuccessMiddleware'),
    UserAuthMiddleware: Symbol('UserAuthMiddleware'),
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
    UserPasswordService: Symbol('UserPasswordService')
}
