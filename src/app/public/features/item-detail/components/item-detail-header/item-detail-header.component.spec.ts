import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from '@core/errors/errors.service';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { MOCK_ITEM, MOCK_ITEM_FEATURED, MOCK_ITEM_SOLD, PURCHASES } from '@fixtures/item.fixtures.spec';
import { MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { MapItemService } from '@public/core/services/map-item/map-item.service';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { SoldModalComponent } from '@shared/modals/sold-modal/sold-modal.component';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { ItemDetailService } from '../../core/services/item-detail/item-detail.service';
import { ItemDetailHeaderComponent } from './item-detail-header.component';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { ItemDetailTrackEventsService } from '../../core/services/item-detail-track-events/item-detail-track-events.service';
import { MockItemdDetailTrackEventService } from '../../core/services/item-detail-track-events/track-events.fixtures.spec';
import { I18nService } from '@core/i18n/i18n.service';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';

describe('ItemDetailHeaderComponent', () => {
  let component: ItemDetailHeaderComponent;
  let fixture: ComponentFixture<ItemDetailHeaderComponent>;
  let checkSessionService: CheckSessionService;
  let itemDetailService: ItemDetailService;
  let itemDetailTrackEventsService: ItemDetailTrackEventsService;
  let permissionService: NgxPermissionsService;
  let modalService: NgbModal;

  const trashButtonId = '#trashButton';
  const favouriteButtonId = '#favouriteButton';
  const featureItemButtonId = '#featureItemButton';
  const chatButtonId = '#chatButton';
  const soldButtonClass = '.ItemDetailHeader__squareButton--sold';
  const reserveButtonClass = '.ItemDetailHeader__squareButton--reserve';
  const editButtonClass = '.ItemDetailHeader__squareButton--edit';
  const optionsButtonClass = '.ItemDetailHeader__squareButton--options';
  const dateCountDownTag = 'tsl-date-countdown';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailHeaderComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, CommonModule, NgxPermissionsModule.forRoot()],
      providers: [
        PublicUserApiService,
        ItemApiService,
        RecommenderApiService,
        MapItemService,
        ToastService,
        I18nService,
        {
          provide: ItemDetailTrackEventsService,
          useClass: MockItemdDetailTrackEventService,
        },
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
        {
          provide: PublicProfileService,
          useValue: {
            getStats() {
              return of();
            },
          },
        },
        {
          provide: CheckSessionService,
          useValue: {
            hasSession() {
              return true;
            },
            checkSessionAction() {},
          },
        },
        {
          provide: ItemDetailService,
          useValue: {
            reserveItem: () => {
              return of();
            },
            deleteItem: () => {
              return of();
            },
            getItemActivePurchases: () => {
              return of(PURCHASES);
            },
          },
        },
        {
          provide: ErrorsService,
          useValue: {
            i18nError() {},
            i18nSuccess() {},
          },
        },
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: {},
              };
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailHeaderComponent);
    component = fixture.componentInstance;
    itemDetailService = TestBed.inject(ItemDetailService);
    checkSessionService = TestBed.inject(CheckSessionService);
    itemDetailTrackEventsService = TestBed.inject(ItemDetailTrackEventsService);
    modalService = TestBed.inject(NgbModal);
    permissionService = TestBed.inject(NgxPermissionsService);
    component.item = MOCK_ITEM;
    component.user = MOCK_USER;
    component.userStats = MOCK_USER_STATS;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is our OWN item...', () => {
    describe('and it is featured...', () => {
      it('should ask for the active purchases', () => {
        spyOn(itemDetailService, 'getItemActivePurchases').and.returnValue(of(PURCHASES));
        component.isOwner = true;
        component.item = MOCK_ITEM_FEATURED;

        component.ngOnInit();
        fixture.detectChanges();

        expect(itemDetailService.getItemActivePurchases).toHaveBeenCalled();
      });
    });

    describe('and the item is sold, onhold, expired or not available...', () => {
      beforeEach(() => {
        component.isOwner = true;
        component.item = MOCK_ITEM_SOLD;

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('only should show the trash button option', () => {
        expect(fixture.debugElement.query(By.css(trashButtonId))).toBeTruthy();
      });

      it('should not  show the other option buttons...', () => {
        expect(fixture.debugElement.query(By.css(favouriteButtonId))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(chatButtonId))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(soldButtonClass))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(reserveButtonClass))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(editButtonClass))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(optionsButtonClass))).toBeFalsy();
      });
    });

    describe('and the item is NOT sold, onhold, expired or not available...', () => {
      beforeEach(() => {
        component.isOwner = true;
        component.item = MOCK_ITEM;

        component.ngOnInit();
        fixture.detectChanges();
      });

      describe('and the item is featured...', () => {
        beforeEach(() => {
          component.item.bumpExpiringDate = 232332323;
        });
        describe('and has visibility permissions', () => {
          beforeEach(() => {
            permissionService.addPermission(PERMISSIONS.bumps);
          });
          it('should show the countdown button', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css(dateCountDownTag))).toBeTruthy();
            expect(fixture.debugElement.query(By.css(featureItemButtonId))).toBeFalsy();
          });
        });
        describe('and has not visibility permissions', () => {
          beforeEach(() => {
            permissionService.removePermission(PERMISSIONS.bumps);
          });
          it('should show the countdown button', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css(dateCountDownTag))).toBeFalsy();
            expect(fixture.debugElement.query(By.css(featureItemButtonId))).toBeFalsy();
          });
        });
      });

      describe('and the item NOT is featured...', () => {
        beforeEach(() => {
          component.item.bumpExpiringDate = null;
        });
        describe('and has visibility permissions', () => {
          beforeEach(() => {
            permissionService.addPermission(PERMISSIONS.bumps);
          });
          it('should show the feature button', () => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css(dateCountDownTag))).toBeFalsy();
            expect(fixture.debugElement.query(By.css(featureItemButtonId))).toBeTruthy();
          });
        });
        describe('and has not visibility permissions', () => {
          beforeEach(() => {
            permissionService.removePermission(PERMISSIONS.bumps);
          });
          it('should show the feature button', () => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css(dateCountDownTag))).toBeFalsy();
            expect(fixture.debugElement.query(By.css(featureItemButtonId))).toBeFalsy();
          });
        });
      });

      it('should show the five button options ', () => {
        expect(fixture.debugElement.queryAll(By.css('.ItemDetailHeader__squareButton'))).toHaveLength(5);
      });

      it('should show the reserve button option', () => {
        expect(fixture.debugElement.query(By.css(reserveButtonClass))).toBeTruthy();
      });

      it('should show the sold button option', () => {
        expect(fixture.debugElement.query(By.css(soldButtonClass))).toBeTruthy();
      });

      it('should show the edit button option', () => {
        expect(fixture.debugElement.query(By.css(editButtonClass))).toBeTruthy();
      });

      it('should show the trash button option', () => {
        expect(fixture.debugElement.query(By.css(trashButtonId))).toBeTruthy();
      });

      it('should render the options button without showing it', () => {
        expect(fixture.debugElement.query(By.css(optionsButtonClass))).toBeTruthy();
      });

      it('should not show the chat and the favourite button options', () => {
        expect(fixture.debugElement.query(By.css(chatButtonId))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(favouriteButtonId))).toBeFalsy();
      });

      describe('when we click on the reserve item button...', () => {
        it('should emit the reserve item event', () => {
          spyOn(component.reservedItemChange, 'emit');

          const reserveButton = fixture.debugElement.query(By.css(reserveButtonClass)).nativeElement;
          reserveButton.click();

          expect(component.reservedItemChange.emit).toHaveBeenCalled();
        });
      });

      describe('when we clic on the sold item button...', () => {
        it('should open the sold modal', fakeAsync(() => {
          spyOn(component.soldItemChange, 'emit');
          spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: {} });

          const soldButton = fixture.debugElement.query(By.css(soldButtonClass)).nativeElement;
          soldButton.click();
          tick();

          expect(modalService.open).toHaveBeenCalledWith(SoldModalComponent, { windowClass: 'sold' });
          expect(component.soldItemChange.emit).toHaveBeenCalled();
        }));
      });

      describe('the edit item button...', () => {
        it('should redirect to the edit item page', () => {
          const catalogEditURL = `/catalog/edit/`;
          const editButton = fixture.debugElement.nativeElement.querySelector(editButtonClass).getAttribute('ng-reflect-router-link');

          expect(editButton).toEqual(catalogEditURL + component.item.id);
        });
      });

      describe('when we clic on the trash item button...', () => {
        it('should open the confirmation delete modal', fakeAsync(() => {
          spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: {} });
          spyOn(itemDetailService, 'deleteItem').and.returnValue(of());

          const trashButton = fixture.debugElement.query(By.css(trashButtonId)).nativeElement;
          trashButton.click();
          tick();

          expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
          expect(itemDetailService.deleteItem).toHaveBeenCalledWith(component.item.id);
        }));
      });
    });
  });

  describe('when is NOT our own item...', () => {
    describe('and the item is sold, onhold, expired or not available...', () => {
      beforeEach(() => {
        component.isOwner = false;
        component.item = MOCK_ITEM_SOLD;
        component.ngOnInit();
        fixture.detectChanges();
      });
      it('should not show any button', () => {
        expect(fixture.debugElement.query(By.css(trashButtonId))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(favouriteButtonId))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(chatButtonId))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(soldButtonClass))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(reserveButtonClass))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(editButtonClass))).toBeFalsy();
        expect(fixture.debugElement.query(By.css(optionsButtonClass))).toBeFalsy();
      });
    });

    describe('and the item is NOT sold, onhold, expired or not available...', () => {
      it('should show the chat option button', () => {
        expect(fixture.debugElement.query(By.css(chatButtonId))).toBeTruthy();
      });

      it('should show the favourite option button', () => {
        expect(fixture.debugElement.query(By.css(favouriteButtonId))).toBeTruthy();
      });

      describe('the chat button...', () => {
        it('should redirect to the item chat page', () => {
          const chatButton = fixture.debugElement.nativeElement.querySelector(chatButtonId);

          expect(chatButton.getAttribute('ng-reflect-router-link')).toEqual('/chat');
        });
      });

      describe('when we clic on the favourite button...', () => {
        describe('and we have a current session...', () => {
          it('should emit the favourite item event', () => {
            spyOn(component.favouritedItemChange, 'emit');

            const favouriteButton = fixture.debugElement.nativeElement.querySelector(favouriteButtonId);
            favouriteButton.click();

            expect(component.favouritedItemChange.emit).toHaveBeenCalled();
          });
        });

        describe('and we NOT have a current session...', () => {
          it('should check the session action', () => {
            spyOn(checkSessionService, 'hasSession').and.returnValue(false);
            spyOn(checkSessionService, 'checkSessionAction');

            const favouriteButton = fixture.debugElement.nativeElement.querySelector(favouriteButtonId);
            favouriteButton.click();

            expect(checkSessionService.checkSessionAction).toHaveBeenCalled();
          });
        });
      });
    });
  });
  describe('After we click the chatButton', () => {
    it('should send track click button event', () => {
      spyOn(itemDetailTrackEventsService, 'trackClickChatButton');

      const chatButton = fixture.debugElement.query(By.css(chatButtonId)).nativeElement;

      chatButton.click();

      expect(itemDetailTrackEventsService.trackClickChatButton).toHaveBeenCalledWith(component.item, component.user);
    });
  });
});
