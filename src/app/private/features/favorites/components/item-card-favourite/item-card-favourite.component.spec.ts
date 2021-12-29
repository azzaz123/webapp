import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { of, BehaviorSubject } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { ItemCardFavouriteComponent } from './item-card-favourite.component';
import { ItemService } from '@core/item/item.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { I18nService } from '@core/i18n/i18n.service';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { By } from '@angular/platform-browser';
import { FavouritesListTrackingEventsService } from '../../services/favourites-list-tracking-events.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@core/core.module';
import { MARKET_PROVIDER } from '@configs/market.config';
import { Router } from '@angular/router';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { SharedModule } from '@shared/shared.module';

describe('ItemCardFavouriteComponent', () => {
  let component: ItemCardFavouriteComponent;
  let fixture: ComponentFixture<ItemCardFavouriteComponent>;
  let element: HTMLElement;
  let itemService: ItemService;
  let modalService: NgbModal;
  let favouritesListTrackingEventsService: FavouritesListTrackingEventsService;
  let router: Router;

  const standaloneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  const modalRef: any = {
    result: Promise.resolve({
      score: 4,
      comments: 'comment',
      userId: USER_ID,
    }),
    componentInstance: {},
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, CoreModule, SharedModule],
        declarations: [ItemCardFavouriteComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          I18nService,
          {
            provide: StandaloneService,
            useValue: {
              standalone$: standaloneSubject.asObservable(),
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: ItemService,
            useValue: {
              favoriteItem() {
                return of({});
              },
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return modalRef;
              },
            },
          },
          {
            provide: SITE_URL,
            useValue: MOCK_SITE_URL,
          },
          {
            provide: FavouritesListTrackingEventsService,
            useValue: {
              trackUnfavouriteItemEvent: () => {},
            },
          },
          {
            provide: MARKET_PROVIDER,
            useValue: 'es',
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardFavouriteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.item = MOCK_ITEM;
    itemService = TestBed.inject(ItemService);
    modalService = TestBed.inject(NgbModal);
    favouritesListTrackingEventsService = TestBed.inject(FavouritesListTrackingEventsService);
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  describe('removeFavorite', () => {
    beforeEach(() => {
      spyOn(component.onFavoriteChange, 'emit');
    });
    it('should set favorited property to false', () => {
      component.item.favorited = true;
      component.removeFavorite();
      expect(component.item.favorited).toBeFalsy();
    });
    it('should call onFavoriteChange emit method', () => {
      component.removeFavorite();
      expect(component.onFavoriteChange.emit).toHaveBeenCalledWith(MOCK_ITEM);
    });
  });

  describe('removeFavoriteModal', () => {
    let removeFavoriteButton;
    beforeEach(fakeAsync(() => {
      spyOn(component, 'removeFavoriteModal').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'removeFavorite').and.callThrough();
      spyOn(favouritesListTrackingEventsService, 'trackUnfavouriteItemEvent');
      removeFavoriteButton = fixture.debugElement.nativeElement.querySelector('tsl-card-footer');
      removeFavoriteButton.click();
    }));

    it('when click tsl-cardFooter should call removeFavoriteModal method', () => {
      expect(component.removeFavoriteModal).toHaveBeenCalled();
    });

    it('should open accept modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
    });

    it('should call removeFavorite method ', fakeAsync(() => {
      tick();
      expect(component.removeFavorite).toHaveBeenCalled();
      expect(favouritesListTrackingEventsService.trackUnfavouriteItemEvent).toHaveBeenCalledTimes(1);
      expect(favouritesListTrackingEventsService.trackUnfavouriteItemEvent).toHaveBeenCalledWith(component.item);
    }));
  });

  describe('when a click is triggered on a favorite item card', () => {
    describe('and the app is on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(true);
        fixture.detectChanges();
        spyOn(router, 'navigate');
      });
      it('should navigate to the favorite item without opening a new tab', () => {
        const expectedUrl: string = `${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM.id}`;
        const itemCard = fixture.debugElement.query(By.css('a')).nativeElement;

        itemCard.click();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });
    describe('and the app is NOT on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(false);
        fixture.detectChanges();
        spyOn(window, 'open');
      });
      it('should navigate to the favorite item in a new tab', () => {
        const expectedUrl: string = `${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM.webSlug}`;
        const itemCard = fixture.debugElement.query(By.css('a')).nativeElement;

        itemCard.click();

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(expectedUrl);
      });
    });
  });
});
