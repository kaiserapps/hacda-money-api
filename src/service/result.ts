export abstract class Result {
    constructor(
        public success: boolean,
        public error?: string
    ) { }
}

export abstract class DataResult<D> {
    constructor(
        success: boolean,
        error?: string,
        public data?: D
    ) { }
}

export class SuccessfulDataResult<D> extends DataResult<D> {
    constructor(
        data?: D
    ) {
        super(true, undefined, data);
    }
}

export class FailedDataResult extends DataResult<{}> {
    constructor(
        error: string
    ) {
        super(false, error);
    }
}

export class SuccessResult extends Result {
    constructor() {
        super(true);
    }
}

export class FailResult extends Result {
    constructor(
        error: string
    ) {
        super(false, error);
    }
}
