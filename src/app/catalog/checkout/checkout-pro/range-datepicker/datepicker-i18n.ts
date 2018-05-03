import { Component, Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { I18nService } from '../../../../core/i18n/i18n.service';

const I18N_VALUES = {
    en: {
        weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    es: {
        weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
        months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    }
};

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

    constructor(private i18nService: I18nService) {
        super();
    }

    getWeekdayShortName(weekday: number): string {
        return I18N_VALUES[this.i18nService.locale].weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return I18N_VALUES[this.i18nService.locale].months[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}

@Component({
    selector: 'tsl-datepicker-i18n',
    templateUrl: './datepicker-i18n.html',
    providers: [I18nService, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})
export class DatepickerComponent {
    model;
}
