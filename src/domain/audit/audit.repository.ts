import { unmanaged } from 'inversify';

import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { Audit } from './audit';
import { IAuditRepository } from './audit.repository.interface';
import { AuditType } from './enums';

import * as _ from 'lodash';

export abstract class AuditRepository implements IAuditRepository {
    constructor(
        @unmanaged() public dateProvider: IDateProvider,
        @unmanaged() public userProvider: IUserProvider
    ) {
    }

    abstract createAudit(klass: string, action: AuditType, data?: any): Promise<void>;
    abstract getLatest(klass: string, max?: number): Promise<Audit>;

    protected async getDiff(klass: string, action: AuditType, data?: any): Promise<Audit> {
        if (action === AuditType.Create) {
            return data;
        }
        else {
            // get latest audit for the class
            const latest = await this.getLatest(klass);
            if (action === AuditType.Delete) {
                return latest;
            }
            else {
                return this.difference(latest, data);
            }
        }
    }

    /**
    * Deep diff between two object, using lodash
    * Thanks, https://gist.github.com/Yimiprod/7ee176597fef230d1451
    * @param  {any} object Object compared
    * @param  {any} base   Object to compare with
    * @return {any}        Return a new object who represent the diff
    */
    private difference(object: any, base: any): any {
        const changes = (o: any, b: any) => {
            return _.transform(o, (result, value, key) => {
                if (!_.isEqual(value, b[key])) {
                    result[key] = (_.isObject(value) && _.isObject(b[key])) ? changes(value, b[key]) : value;
                }
            });
        }
        return changes(object, base);
    }
}
