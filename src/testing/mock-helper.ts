import * as TypeMoq from 'typemoq';

export class MockHelper {
    static makeResolvable<T>(mock: TypeMoq.IMock<T>) {
        mock.setup((x: any) => x.then).returns(() => undefined);
    }
}
