import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from '@core/errors/errors.service';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { MOCK_ITEM, MOCK_ITEM_SOLD, PURCHASES } from '@fixtures/item.fixtures.spec';
import { MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { SoldModalComponent } from '@shared/modals/sold-modal/sold-modal.component';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { ItemDetailService } from '../../core/services/item-detail/item-detail.service';
import { MOCK_ITEM_7 } from '@public/shared/components/item-card/item-card.mock.stories';

import { ItemDetailHeaderComponent } from './item-detail-header.component';

describe('ItemDetailHeaderComponent', () => {
  let component: ItemDetailHeaderComponent;
  let fixture: ComponentFixture<ItemDetailHeaderComponent>;
  let checkSessionService: CheckSessionService;
  let itemCardService: ItemCardService;
  let itemDetailService: ItemDetailService;
  let modalService: NgbModal;

  const trashButtonId = '#trashButton';
  const favouriteButtonId = '#favouriteButton';
  const featureItemButtonId = '#featureItemButton';
  const chatButtonId = '#chatButton';
  const soldButtonClass = '.btn-sold';
  const reserveButtonClass = '.btn-reserve';
  const editButtonClass = '.btn-edit';
  const optionsButtonClass = '.btn-options';
  const dateCountDownTag = 'tsl-date-countdown';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailHeaderComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, CommonModule],
      providers: [
        PublicUserApiService,
        ItemCardService,
        ItemApiService,
        RecommenderApiService,
        MapItemService,
        ToastService,
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
            getActivePurchases: () => {
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
    itemCardService = TestBed.inject(ItemCardService);
    checkSessionService = TestBed.inject(CheckSessionService);
    modalService = TestBed.inject(NgbModal);
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
        spyOn(itemDetailService, 'getActivePurchases').and.returnValue(of(PURCHASES));
        component.isOwner = true;
        component.item = MOCK_ITEM_7;

        component.ngOnInit();
        fixture.detectChanges();

        expect(itemDetailService.getActivePurchases).toHaveBeenCalled();
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
          fixture.detectChanges();
        });
        it('should show the countdown button', () => {
          expect(fixture.debugElement.query(By.css(dateCountDownTag))).toBeTruthy();
          expect(fixture.debugElement.query(By.css(featureItemButtonId))).toBeFalsy();
        });
      });

      describe('and the item NOT is featured...', () => {
        beforeEach(() => {
          component.item.bumpExpiringDate = null;
          fixture.detectChanges();
        });
        it('should show the feature button', () => {
          expect(fixture.debugElement.query(By.css(dateCountDownTag))).toBeFalsy();
          expect(fixture.debugElement.query(By.css(featureItemButtonId))).toBeTruthy();
        });
      });

      it('should show the five button options ', () => {
        expect(fixture.debugElement.queryAll(By.css('.OwnActionButtons__action'))).toHaveLength(5);
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

      describe('when we clic on the reserve item button...', () => {
        it('should ask for the reserve item function', () => {
          spyOn(component, 'reserveItem').and.callThrough();
          spyOn(itemDetailService, 'reserveItem');

          const reserveButton = fixture.debugElement.query(By.css(reserveButtonClass)).nativeElement;
          reserveButton.click();

          expect(component.reserveItem).toHaveBeenCalled();
          expect(itemDetailService.reserveItem).toHaveBeenCalledWith(component.item.id, !component.item.reserved);
        });
      });

      describe('when we clic on the sold item button...', () => {
        afterEach(() => {
          component.item.sold = false;
        });
        it('should open the sold modal', () => {
          spyOn(component, 'soldItem').and.callThrough();
          spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: {} });

          const soldButton = fixture.debugElement.query(By.css(soldButtonClass)).nativeElement;
          soldButton.click();

          expect(component.soldItem).toHaveBeenCalled();
          expect(modalService.open).toHaveBeenCalledWith(SoldModalComponent, { windowClass: 'sold' });
          expect(component.item.sold).toBe(true);
        });
      });

      describe('the edit item button...', () => {
        it('should redirect to the edit item page', () => {
          const catalogEditURL = `/catalog/edit/`;
          const editButton = fixture.debugElement.nativeElement.querySelector(editButtonClass).getAttribute('ng-reflect-router-link');

          expect(editButton).toEqual(catalogEditURL + component.item.id);
        });
      });

      describe('when we clic on the trash item button...', () => {
        it('should open the confirmation delete modal', () => {
          spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve() });
          spyOn(component, 'deleteItem').and.callThrough();
          spyOn(itemDetailService, 'deleteItem').and.returnValue(of());

          const trashButton = fixture.debugElement.query(By.css(trashButtonId)).nativeElement;
          trashButton.click();

          expect(component.deleteItem).toHaveBeenCalled();
          expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent, { windowClass: 'modal-prompt' });
          expect(itemDetailService.deleteItem).toHaveBeenCalledWith(component.item.id);
        });
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
          it('should toggle the favourite button', () => {
            spyOn(itemCardService, 'toggleFavourite');

            const favouriteButton = fixture.debugElement.nativeElement.querySelector(favouriteButtonId);
            favouriteButton.click();

            expect(itemCardService.toggleFavourite).toHaveBeenCalledWith(component.item);
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
});
