import * as TypeMoq from 'typemoq';

import { MomentDateProvider } from './moment-date.provider';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('moment date provider', () => {

    it('gets current system date', done => {
        // Arrange
        const clock = jasmine.clock();
        const testDate = new Date(2018, 0, 1, 0, 0, 0, 0);
        clock.mockDate(testDate);
        clock.withMock(() => {
            // Act
            const dateProv = new MomentDateProvider();

            // Assert
            expect(dateProv.currentDateTicks).toBe(testDate.getTime());
            done();
        });
    });
});
