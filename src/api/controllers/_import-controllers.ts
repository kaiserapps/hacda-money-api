// Must be first so that Reflect Metadata is present to import the controllers properly
import '../../polyfills';
import './error.controller';
import './auth/auth-basic.controller';
import './auth/auth-facebook.controller';
import './auth/auth-github.controller';
import './auth/auth-google.controller';
import './test/test-auth.controller';
