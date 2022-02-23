import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GetUserScheduleApiService } from '@api/bff/delivery/user_schedule/get-user-schedule-api.service';
import { DeliverySchedule } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { SelectUserScheduleApiService } from '@api/delivery/user_schedule/select-user-schedule-api.service';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { MOCK_DELIVERY_SCHEDULE } from '@fixtures/private/delivery/schedule/delivery-schedule.fixtures.spec';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { DeliveryPreferenceScheduleComponent } from './delivery-preference-schedule.component';

describe('DeliveryPreferenceScheduleComponent', () => {
  const MOCK_DELIVERY_PICK_UP_DAY: string = '27 de Enero del 1999';
  const homePickUpDeliverySchedulesSubjectMock: BehaviorSubject<DeliverySchedule> = new BehaviorSubject(MOCK_DELIVERY_SCHEDULE);
  let component: DeliveryPreferenceScheduleComponent;
  let fixture: ComponentFixture<DeliveryPreferenceScheduleComponent>;
  let selectUserScheduleApiService: SelectUserScheduleApiService;
  let errorsService: ErrorsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, NgbButtonsModule],
      declarations: [DeliveryPreferenceScheduleComponent, ButtonComponent],
      providers: [
        {
          provide: SelectUserScheduleApiService,
          useValue: {
            homePickUpDeliverySchedule() {
              return of(null);
            },
          },
        },
        {
          provide: GetUserScheduleApiService,
          useValue: {
            homePickUpDeliverySchedules() {
              return homePickUpDeliverySchedulesSubjectMock.asObservable();
            },
          },
        },
        {
          provide: ErrorsService,
          useValue: {
            i18nError() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    selectUserScheduleApiService = TestBed.inject(SelectUserScheduleApiService);
    errorsService = TestBed.inject(ErrorsService);
    fixture = TestBed.createComponent(DeliveryPreferenceScheduleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we enter in the schedule page', () => {
    beforeEach(() => {
      spyOn(errorsService, 'i18nError').and.callThrough();
    });

    describe('and we get the schedules', () => {
      beforeEach(() => {
        component.deliveryPickUpDay = MOCK_DELIVERY_PICK_UP_DAY;
        homePickUpDeliverySchedulesSubjectMock.next(MOCK_DELIVERY_SCHEDULE);

        fixture.detectChanges();
      });

      it('should show the pick up day text', () => {
        const pickUpDay = fixture.debugElement.query(By.css('#pickUpDay')).nativeElement;
        const expectedText: string = $localize`:@@time_slot_view_seller_hpu_ba_description_with_details:The pick up will be on ${MOCK_DELIVERY_PICK_UP_DAY}:INTERPOLATION:. The courier company will try to adhere to the slot you indicated.`;

        expect(pickUpDay.textContent).toEqual(expectedText);
      });

      it('should define the selected schedule', () => {
        expect(component.selectedSchedule).toStrictEqual(MOCK_DELIVERY_SCHEDULE.scheduleOptions.allDay.scheduleTimeRange);
      });

      it('should show the template', () => {
        shouldShowPreferenceSchedule(true);
      });

      it('should NOT show an error', () => {
        expect(errorsService.i18nError).not.toHaveBeenCalled();
      });

      it('should show the three available options', () => {
        expect(fixture.debugElement.queryAll(By.css('.DeliveryPreferenceSchedule__scheduleOption')).length).toBe(3);
      });

      it('should show the save button', () => {
        const saveButton: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));
        expect(saveButton).toBeTruthy();
      });

      describe('when we show the all day option', () => {
        it('should show the all day time range text', () => {
          const allDayOptionDescription = fixture.debugElement.query(By.css('#allDayOptionDescription')).nativeElement;
          const expectedText: string = $localize`:@@time_slot_view_seller_hpu_ba_all_day_button:All day (from ${MOCK_DELIVERY_SCHEDULE.scheduleOptions.allDay.startTimeRange}:INTERPOLATION: to ${MOCK_DELIVERY_SCHEDULE.scheduleOptions.allDay.endTimeRange}:INTERPOLATION:)`;

          expect(allDayOptionDescription.textContent).toEqual(expectedText);
        });
      });

      describe('when we show the morning option', () => {
        it('should show the morning time range text', () => {
          const morningOptionDescription = fixture.debugElement.query(By.css('#morningOptionDescription')).nativeElement;
          const expectedText: string = $localize`:@@time_slot_view_seller_hpu_ba_morning_button:Morning (from ${MOCK_DELIVERY_SCHEDULE.scheduleOptions.morning.startTimeRange}:INTERPOLATION: to ${MOCK_DELIVERY_SCHEDULE.scheduleOptions.morning.endTimeRange}:INTERPOLATION:)`;

          expect(morningOptionDescription.textContent).toEqual(expectedText);
        });
      });

      describe('when we show the afternoon option', () => {
        it('should show the afternoon time range text', () => {
          const afternoonOptionDescription = fixture.debugElement.query(By.css('#afternoonOptionDescription')).nativeElement;
          const expectedText: string = $localize`:@@time_slot_view_seller_hpu_ba_afternoon_button:Afternoon (from ${MOCK_DELIVERY_SCHEDULE.scheduleOptions.afternoon.startTimeRange}:INTERPOLATION: to ${MOCK_DELIVERY_SCHEDULE.scheduleOptions.afternoon.endTimeRange}:INTERPOLATION:)`;

          expect(afternoonOptionDescription.textContent).toEqual(expectedText);
        });
      });

      describe('when we have a selected schedule', () => {
        xit('should NOT show the save button disabled', () => {
          const saveButton = fixture.debugElement.query(By.directive(ButtonComponent)).nativeNode;
          expect(saveButton.disabled).toBe(false);
        });

        describe('and we click on the save button', () => {
          beforeEach(() => {
            spyOn(component.scheduleSaveSucceded, 'emit');
          });

          xdescribe('and the petition succeed', () => {
            beforeEach(() => {
              spyOn(selectUserScheduleApiService, 'homePickUpDeliverySchedule').and.callThrough();

              const saveButton = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
              saveButton.click();
            });

            it('should ask the server to select the new schedule', () => {
              expect(selectUserScheduleApiService.homePickUpDeliverySchedule).toBeCalledTimes(1);
              expect(selectUserScheduleApiService.homePickUpDeliverySchedule).toHaveBeenLastCalledWith(
                MOCK_DELIVERY_SCHEDULE.userSchedule.id,
                component.selectedSchedule
              );
            });

            it('should NOT show an error', () => {
              expect(errorsService.i18nError).not.toHaveBeenCalled();
            });

            it('should notify schedule save succeded', () => {
              expect(component.scheduleSaveSucceded.emit).toHaveBeenCalledTimes(1);
            });
          });

          xdescribe('and the petition fails', () => {
            beforeEach(() => {
              spyOn(selectUserScheduleApiService, 'homePickUpDeliverySchedule').and.returnValue(throwError('>:D'));

              fixture.detectChanges();
              const saveButton = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
              saveButton.click();
            });

            it('should ask the server to select the new schedule', () => {
              expect(selectUserScheduleApiService.homePickUpDeliverySchedule).toBeCalledTimes(1);
              expect(selectUserScheduleApiService.homePickUpDeliverySchedule).toHaveBeenLastCalledWith(
                MOCK_DELIVERY_SCHEDULE.userSchedule.id,
                component.selectedSchedule
              );
            });

            it('should show an error', () => {
              expect(errorsService.i18nError).toHaveBeenCalledTimes(1);
            });

            it('should NOT notify schedule save succeded', () => {
              expect(component.scheduleSaveSucceded.emit).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe(`when we DON'T have a selected schedule`, () => {
        beforeEach(() => {
          component.selectedSchedule = null;
          fixture.detectChanges();
        });

        xit('should show the save button disabled', () => {
          const saveButton = fixture.debugElement.query(By.directive(ButtonComponent)).nativeNode;
          expect(saveButton.disabled).toBe(true);
        });
      });
    });

    describe(`and we DON'T get the schedules`, () => {
      beforeEach(() => {
        homePickUpDeliverySchedulesSubjectMock.error('network error');

        fixture.detectChanges();
      });

      it('should NOT show the template', () => {
        shouldShowPreferenceSchedule(false);
      });

      it('should show an error', () => {
        expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.ACCEPT_SCREEN_SCHEDULES_SAVE_ERROR);
        expect(errorsService.i18nError).toHaveBeenCalledTimes(1);
      });
    });
  });

  function shouldShowPreferenceSchedule(shouldBeShowed: boolean): void {
    const preferenceSchedule: DebugElement = fixture.debugElement.query(By.css('.DeliveryPreferenceSchedule'));
    if (shouldBeShowed) {
      expect(preferenceSchedule).toBeTruthy();
    } else {
      expect(preferenceSchedule).toBeFalsy();
    }
  }
});
