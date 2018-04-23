import { injectable } from 'inversify';
import * as moment from 'moment';

import { IDateProvider } from './date.provider.interface';

@injectable()
export class MomentDateProvider implements IDateProvider {
    get currentDateTicks(): number {
        return moment().toDate().getTime();
    }
}
