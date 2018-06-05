import { AuditType } from './enums';

export interface IAudit {
    id: string;
    klass: string;
    action: AuditType;
    username: string;
    timestamp: number;
    data?: any;
}

export class Audit implements IAudit {
    _id: string;
    username: string;
    timestamp: number;

    get id(): string {
        return this._id;
    }

    constructor(
        public klass: string,
        public action: AuditType,
        public data?: any
    ) {
    }
}
