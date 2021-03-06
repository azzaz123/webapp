import { of } from 'rxjs';
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
import { FavouritesListTrackingEventsService } from '../../services/favourites-list-tracking-events.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@core/core.module';
import { MARKET_PROVIDER } from '@configs/market.config';
import { ItemRouteMockDirective } from '@fixtures/item-route.fixtures.spec';

describe('ItemCardFavouriteComponent', () => {
  let component: ItemCardFavouriteComponent;
  let fixture: ComponentFixture<ItemCardFavouriteComponent>;
  let element: HTMLElement;

  let itemService: ItemService;
  let modalService: NgbModal;
  let favouritesListTrackingEventsService: FavouritesListTrackingEventsService;

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
        imports: [HttpClientTestingModule, CoreModule],
        declarations: [ItemCardFavouriteComponent, CustomCurrencyPipe, ItemRouteMockDirective],
        providers: [
          DecimalPipe,
          I18nService,
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
  });

  describe('removeFavorite', () => {
    beforeEach(() => {
      spyOn(component.favoriteChange, 'emit');
    });
    it('should set favorited property to false', () => {
      component.item.favorited = true;
      component.removeFavorite();
      expect(component.item.favorited).toBeFalsy();
    });
    it('should call onFavoriteChange emit method', () => {
      component.removeFavorite();
      expect(component.favoriteChange.emit).toHaveBeenCalledWith(MOCK_ITEM);
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
});
