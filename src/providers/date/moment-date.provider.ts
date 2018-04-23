import { injectable } from 'inversify';
import * as moment from 'moment';

import { IDateProvider } from './date.provider.interface';

@injectable()
export class MomentDateProvider implements IDateProvider {
    private _current: any;

    get currentDateTicks(): number {
        return moment().toDate().getTime();
    }

    setCurrent(date: Date) {

    }
}
