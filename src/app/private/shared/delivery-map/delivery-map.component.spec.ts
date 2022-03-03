import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryMapComponent } from './delivery-map.component';
import { DeliveryMapService } from './delivery-map.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { I18nService } from '@core/i18n/i18n.service';
import { ErrorsService } from '@core/errors/errors.service';
import { By } from '@angular/platform-browser';
import { MOCK_ACCEPT_SCREEN_PROPERTIES } from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  MOCK_CARRIERS_OFFICE_INFO,
  MOCK_CARRIER_OFFICE_SCHEDULE,
} from '@fixtures/private/delivery/carrier-office-info/carrier-office-info.fixtures.spec';
import { MockErrorService } from '@fixtures/error.fixtures.spec';
import { MOCK_FULL_ADDRESS, MOCK_LOCATION } from '@fixtures/private/delivery/delivery-map/delivery-map.fixtures.spec';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_LOCATION_WITH_RADIUS } from '@fixtures/core/geolocation/location-with-radius.fixtures.spec';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { CarrierOfficeSchedule } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { COLORS } from '@core/colors/colors-constants';

describe('DeliveryMapComponent', () => {
  const componentInstance: any = {};
  const selectedOfficeInformationSubject: BehaviorSubject<CarrierOfficeSchedule> = new BehaviorSubject(null);
  const searchableMapSelector: string = 'tsl-searchable-movable-map';
  const buttonSelector: string = 'tsl-button';
  const MOCK_TRANSLATION: string = 'Laia :3';

  let component: DeliveryMapComponent;
  let deliveryMapService: DeliveryMapService;
  let fixture: ComponentFixture<DeliveryMapComponent>;
  let errorsService: ErrorsService;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbModalModule],
      declarations: [DeliveryMapComponent],
      providers: [
        {
          provide: ErrorsService,
          useClass: MockErrorService,
        },
        {
          provide: I18nService,
          useValue: {
            translate() {
              return MOCK_TRANSLATION;
            },
          },
        },
        {
          provide: DeliveryMapService,
          useValue: {
            initializeOffices$() {
              return of(MOCK_CARRIERS_OFFICE_INFO);
            },
            initialCenterLocation$() {
              return of(MOCK_LOCATION);
            },
            requestOffices$() {
              return of(null);
            },
            selectOfficePreference$() {
              return of(null);
            },
            markOffice() {},
            resetSelectedOffice() {},
            get selectedOfficeInformation$() {
              return selectedOfficeInformationSubject.asObservable();
            },
            get officeMarkers$() {
              return of(null);
            },
            get carrierOffices$() {
              return of(null);
            },
          },
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                componentInstance: componentInstance,
                result: Promise.resolve(),
              };
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    deliveryMapService = TestBed.inject(DeliveryMapService);
    modalService = TestBed.inject(NgbModal);
    errorsService = TestBed.inject(ErrorsService);
    fixture = TestBed.createComponent(DeliveryMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the delivery map initializes... ', () => {
    describe('and we initialize the available offices', () => {
      beforeEach(() => {
        const MOCK_FULL_ADDRESS_CHANGED = { fullAddress: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress } as any;
        component.fullAddress = MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress;
        component.selectedCarrier = POST_OFFICE_CARRIER.SEUR;
        spyOn(deliveryMapService, 'initializeOffices$').and.callThrough();
        spyOn(deliveryMapService, 'initialCenterLocation$').and.callThrough();

        component.ngOnChanges(MOCK_FULL_ADDRESS_CHANGED);
        fixture.detectChanges();
      });

      it('should request the available offices', () => {
        expect(deliveryMapService.initializeOffices$).toHaveBeenCalledTimes(1);
        expect(deliveryMapService.initializeOffices$).toBeCalledWith(
          MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress,
          POST_OFFICE_CARRIER.SEUR
        );
      });

      it('should request the center location', () => {
        expect(deliveryMapService.initialCenterLocation$).toHaveBeenCalledTimes(1);
        expect(deliveryMapService.initialCenterLocation$).toBeCalledWith(MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress);
      });

      it('should show the searchable movable map', () => {
        expect(fixture.debugElement.query(By.css(searchableMapSelector))).toBeTruthy();
      });

      describe('and we click in a office marker', () => {
        beforeEach(() => {
          spyOn(deliveryMapService, 'markOffice');
          fixture.debugElement.query(By.css(searchableMapSelector)).triggerEventHandler('tapMarker', MOCK_LOCATION);

          fixture.detectChanges();
        });

        it('should request to mark it', () => {
          expect(deliveryMapService.markOffice).toHaveBeenCalledTimes(1);
          expect(deliveryMapService.markOffice).toHaveBeenCalledWith(MOCK_LOCATION);
        });
      });

      describe('and we click in the map', () => {
        beforeEach(() => {
          spyOn(deliveryMapService, 'resetSelectedOffice');
          fixture.debugElement.query(By.css(searchableMapSelector)).triggerEventHandler('tapMap', {});

          fixture.detectChanges();
        });

        it('should reset the selected marker', () => {
          expect(deliveryMapService.resetSelectedOffice).toHaveBeenCalledTimes(1);
        });
      });

      describe('and the user changes the view', () => {
        beforeEach(() => {
          spyOn(errorsService, 'i18nError').and.callThrough();
        });

        describe('and the available petition fails', () => {
          beforeEach(() => {
            spyOn(deliveryMapService, 'requestOffices$').and.returnValue(throwError('network error!'));
            fixture.debugElement.query(By.css(searchableMapSelector)).triggerEventHandler('mapViewChangeEnd', MOCK_LOCATION_WITH_RADIUS);

            fixture.detectChanges();
          });

          it('should request the new available offices', () => {
            expect(deliveryMapService.requestOffices$).toHaveBeenCalledTimes(1);
            expect(deliveryMapService.requestOffices$).toHaveBeenCalledWith(MOCK_LOCATION_WITH_RADIUS, component.selectedCarrier);
          });

          it('should show an error ', () => {
            expect(errorsService.i18nError).toHaveBeenCalledTimes(1);
            expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.DELIVERY_MAP_GENERIC_ERROR);
          });
        });

        describe('and the available petition succeeded', () => {
          beforeEach(() => {
            spyOn(deliveryMapService, 'requestOffices$').and.returnValue(of());
            fixture.debugElement.query(By.css(searchableMapSelector)).triggerEventHandler('mapViewChangeEnd', MOCK_LOCATION_WITH_RADIUS);

            fixture.detectChanges();
          });

          it('should request the new available offices', () => {
            expect(deliveryMapService.requestOffices$).toHaveBeenCalledTimes(1);
            expect(deliveryMapService.requestOffices$).toHaveBeenCalledWith(MOCK_LOCATION_WITH_RADIUS, component.selectedCarrier);
          });

          it('should NOT show an error ', () => {
            expect(errorsService.i18nError).not.toHaveBeenCalled();
          });
        });
      });

      describe('and we have a selected office', () => {
        beforeEach(() => {
          selectedOfficeInformationSubject.next(MOCK_CARRIER_OFFICE_SCHEDULE);

          fixture.detectChanges();
        });

        it('should show the selected office information', () => {
          shouldShowOfficeInformation(true);
        });

        it('should show the correct office info name', () => {
          const title: HTMLElement = fixture.debugElement.query(By.css('.DeliveryMap__title')).nativeElement;
          expect(title.textContent).toEqual(MOCK_CARRIER_OFFICE_SCHEDULE.name);
        });

        it.each([
          [MOCK_CARRIER_OFFICE_SCHEDULE.openingHours[0], 0],
          [MOCK_CARRIER_OFFICE_SCHEDULE.openingHours[1], 1],
        ])('should show the correct office info hours', (info: string, index: number) => {
          const description: HTMLElement = fixture.debugElement.queryAll(By.css('.DeliveryMap__description'))[index].nativeElement;
          expect(description.textContent).toEqual(info);
        });

        describe('and we click on the select button', () => {
          describe(`and we DON'T have the full address defined`, () => {
            beforeEach(() => {
              spyOn(component.goToDeliveryAddress, 'emit');

              component.fullAddress = null;
            });

            describe('and we click on the confirm button', () => {
              beforeEach(() => {
                spyOn(modalService, 'open').and.callThrough();

                fixture.debugElement.query(By.css(buttonSelector)).nativeElement.click();
              });

              it('should set the properties in the modal', () => {
                expect(componentInstance.properties).toStrictEqual({
                  description: MOCK_TRANSLATION,
                  confirmMessage: MOCK_TRANSLATION,
                  cancelMessage: MOCK_TRANSLATION,
                  confirmColor: COLORS.WALLA_MAIN,
                  cancelColor: COLORS.WALLA_MAIN,
                });
              });

              it('should open the delivery address warning modal', () => {
                expect(modalService.open).toHaveBeenCalledTimes(1);
                expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
              });

              it('should emit that we should go to the delivery address step', () => {
                expect(component.goToDeliveryAddress.emit).toHaveBeenCalledTimes(1);
              });
            });

            describe('and we click on the dismiss button', () => {
              beforeEach(() => {
                spyOn(modalService, 'open').and.returnValue({ result: Promise.reject(), componentInstance });

                fixture.debugElement.query(By.css(buttonSelector)).nativeElement.click();
              });

              it('should open the delivery address warning modal', () => {
                expect(modalService.open).toHaveBeenCalledTimes(1);
                expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
              });

              it('should NOT emit that we should go to the delivery address step', () => {
                expect(component.goToDeliveryAddress.emit).not.toHaveBeenCalled();
              });
            });
          });

          describe('and we have the full address defined', () => {
            beforeEach(() => {
              spyOn(component.selectedOfficeSucceeded, 'emit');
              component.fullAddress = MOCK_FULL_ADDRESS;
            });

            describe('and the petition succeeded', () => {
              beforeEach(() => {
                spyOn(deliveryMapService, 'selectOfficePreference$').and.returnValue(of(null));

                fixture.debugElement.query(By.css(buttonSelector)).nativeElement.click();
              });

              it('should emit that selected office succeeded', () => {
                expect(component.selectedOfficeSucceeded.emit).toHaveBeenCalledTimes(1);
              });
            });

            describe('and the petition fails', () => {
              beforeEach(() => {
                spyOn(errorsService, 'i18nError').and.callThrough();
                spyOn(deliveryMapService, 'selectOfficePreference$').and.returnValue(throwError('network error'));

                fixture.debugElement.query(By.css(buttonSelector)).nativeElement.click();
              });

              it('should NOT emit that selected office succeeded', () => {
                expect(component.selectedOfficeSucceeded.emit).not.toHaveBeenCalled();
              });

              it('should show an error', () => {
                expect(errorsService.i18nError).toHaveBeenCalledTimes(1);
                expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.DELIVERY_MAP_GENERIC_ERROR);
              });
            });
          });
        });
      });

      describe(`and we don't have a selected office`, () => {
        beforeEach(() => {
          selectedOfficeInformationSubject.next(null);

          fixture.detectChanges();
        });

        it('should NOT show any selected office information', () => {
          shouldShowOfficeInformation(false);
        });
      });
    });
  });

  describe('when we leave the delivery map...', () => {
    beforeEach(() => {
      spyOn(deliveryMapService, 'resetSelectedOffice');

      component.ngOnDestroy();
    });

    it('should reset the selected marker', () => {
      expect(deliveryMapService.resetSelectedOffice).toHaveBeenCalledTimes(1);
    });
  });

  function shouldShowOfficeInformation(isShowed: boolean): void {
    const information: DebugElement = fixture.debugElement.query(By.css('.DeliveryMap__selectedOfficeInfo'));
    if (isShowed) {
      expect(information).toBeTruthy();
    } else {
      expect(information).toBeFalsy();
    }
  }
});
