import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface CalendarDates {
    fromDate?: NgbDateStruct;
    toDate?: NgbDateStruct;
    formattedFromDate?: string;
    formattedToDate?: string;
}
