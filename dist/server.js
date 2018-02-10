"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var bodyParser = require("body-parser");
var inversify_1 = require("inversify");
var inversify_express_utils_1 = require("inversify-express-utils");
var custom_auth_provider_1 = require("./api/middleware/custom-auth.provider");
var logging_middleware_1 = require("./api/middleware/logging.middleware");
var auth_service_1 = require("./service/auth.service");
var ioc_types_1 = require("./ioc-types");
// declare metadata by @controller annotation
require("./api/controllers/foo.controller");
// set up container
var container = new inversify_1.Container();
// set up bindings
container.bind(ioc_types_1.TYPES.AuthService).to(auth_service_1.AuthService).inRequestScope();
container.bind(ioc_types_1.TYPES.LoggingMiddleware).to(logging_middleware_1.LoggingMiddleware);
// create server
var server = new inversify_express_utils_1.InversifyExpressServer(container, null, null, null, custom_auth_provider_1.CustomAuthProvider);
server.setConfig(function (app) {
    // add body parser
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
});
var app = server.build();
app.listen(3000);
//# sourceMappingURL=server.js.map