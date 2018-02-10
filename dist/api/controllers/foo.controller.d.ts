import { interfaces, BaseHttpController } from 'inversify-express-utils';
export declare class FooController extends BaseHttpController implements interfaces.Controller {
    private index(id);
    private list(start, count);
}
