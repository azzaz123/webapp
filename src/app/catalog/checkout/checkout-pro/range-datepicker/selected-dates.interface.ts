import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface SelectedDates {
    fromDate?: NgbDateStruct;
    toDate?: NgbDateStruct;
    formattedFromDate?: string;
    formattedToDate?: string;
    numberOfDays?: number;
}
