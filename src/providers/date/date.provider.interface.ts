export interface IDateProvider {
    currentDateTicks: number;
    setCurrent(date: Date);
}
