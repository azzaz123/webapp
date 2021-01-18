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
import { ItemCartFavoriteComponent } from './item-cart-favorite.component';
import { ItemService } from '@core/item/item.service';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { TrackingService } from '@core/tracking/tracking.service';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { MockTrackingService } from '@fixtures/tracking.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';

describe('ItemCartFavoriteComponent', () => {
  let component: ItemCartFavoriteComponent;
  let fixture: ComponentFixture<ItemCartFavoriteComponent>;
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
        declarations: [ItemCartFavoriteComponent, CustomCurrencyPipe],
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
    fixture = TestBed.createComponent(ItemCartFavoriteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.item = MOCK_ITEM;
    itemService = TestBed.inject(ItemService);
    modalService = TestBed.inject(NgbModal);
    subdomain = TestBed.inject(<any>'SUBDOMAIN');

    fixture.detectChanges();
  });

  describe('goToItemDetail', () => {
    it('should change window url', () => {
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
      removeFavoriteButton = fixture.debugElement.nativeElement.querySelector(
        'tsl-card-footer'
      );
      removeFavoriteButton.click();
    }));

    it('when click tsl-cardFooter should call removeFavoriteModal method', () => {
      expect(component.removeFavoriteModal).toHaveBeenCalled();
    });

    it('should open accept modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(
        ConfirmationModalComponent,
        { windowClass: 'modal-prompt' }
      );
    });

    it('should set modal type "3" ', () => {
      expect(modalRef.componentInstance.type).toEqual(3);
    });

    it('should call removeFavorite method ', fakeAsync(() => {
      tick();
      expect(component.removeFavorite).toHaveBeenCalled();
    }));
  });
});
