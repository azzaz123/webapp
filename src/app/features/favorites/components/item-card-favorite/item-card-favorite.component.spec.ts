import { of } from 'rxjs';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { ItemCardFavoriteComponent } from './item-card-favorite.component';
import { ItemService } from '@core/item/item.service';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { TrackingService } from '@core/tracking/tracking.service';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { MockTrackingService } from '@fixtures/tracking.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';

describe('ItemCardFavoriteComponent', () => {
  let component: ItemCardFavoriteComponent;
  let fixture: ComponentFixture<ItemCardFavoriteComponent>;
  let element: HTMLElement;

  let itemService: ItemService;
  let subdomain: string;
  let modalService: NgbModal;

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
        imports: [],
        declarations: [ItemCardFavoriteComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
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
          { provide: TrackingService, useClass: MockTrackingService },
          { provide: 'SUBDOMAIN', useValue: 'www' },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardFavoriteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.item = MOCK_ITEM;
    itemService = TestBed.inject(ItemService);
    modalService = TestBed.inject(NgbModal);
    subdomain = TestBed.inject(<any>'SUBDOMAIN');

    fixture.detectChanges();
  });

  describe('goToItemDetail', () => {
    it('should go to product detail page', () => {
      spyOn(window, 'open');
      const MOCK_ITEM_URL: string =
        environment.siteUrl.replace('es', subdomain) +
        'item/' +
        MOCK_ITEM.webSlug;
      component.goToItemDetail();
      expect(window.open).toHaveBeenCalledWith(MOCK_ITEM_URL);
    });
  });

  describe('removeFavorite', () => {
    beforeEach(() => {
      spyOn(component.onFavoriteChange, 'emit');
    });

    it('should remove product from favorite after clicking Remove button', () => {
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
      removeFavoriteButton = fixture.debugElement.nativeElement.querySelector(
        'tsl-card-footer'
      );
      removeFavoriteButton.click();
    }));

    it('when click on the footer of the product card, we should open a modal for asking to remove the product from favorite', () => {
      expect(component.removeFavoriteModal).toHaveBeenCalled();
    });

    it('should remove the product from favourites after confirming to remove in the modal', fakeAsync(() => {
      tick();
      expect(component.removeFavorite).toHaveBeenCalled();
    }));
  });
});
