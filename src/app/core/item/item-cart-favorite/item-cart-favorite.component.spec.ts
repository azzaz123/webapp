import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ItemCartFavoriteComponent } from './item-cart-favorite.component';
import { MatIconModule } from '@angular/material';
import { ItemService } from '../item.service';
import { WindowRef, USER_ID, MockTrackingService } from 'shield';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  MOCK_ITEM
} from 'shield';
import {ConfirmationModalComponent} from '../../../shared/confirmation-modal/confirmation-modal.component';
import { TrackingService } from '../../tracking/tracking.service';

describe('ItemCartFavoriteComponent', () => {
  let component: ItemCartFavoriteComponent;
  let fixture: ComponentFixture<ItemCartFavoriteComponent>;
  let element: HTMLElement;

  let itemService: ItemService;
  let windowRef: WindowRef;
  let subdomain: string;
  let modalService: NgbModal;

  const modalRef: any = {
    result: Promise.resolve({
      score: 4,
      comments: 'comment',
      userId: USER_ID
    }),
    componentInstance: {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatIconModule ],
      declarations: [ ItemCartFavoriteComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        { provide: WindowRef, useValue: {
            nativeWindow: {
              open: () => {}
            }
          }
        },
        { provide: ItemService, useValue: {
            favoriteItem () {
              return Observable.of({});
            }
          }
        },
        { provide: NgbModal, useValue: {
            open() {
              return modalRef;
            }
          }
        },
        {provide: TrackingService, useClass: MockTrackingService},
        { provide: 'SUBDOMAIN', useValue: 'www'}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCartFavoriteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.item = MOCK_ITEM;
    itemService = TestBed.get(ItemService);
    windowRef = TestBed.get(WindowRef);
    modalService = TestBed.get(NgbModal);
    subdomain = TestBed.get('SUBDOMAIN');

    fixture.detectChanges();
  });

  describe('goToItemDetail', () => {
    it('should change window url', () => {
      spyOn(windowRef.nativeWindow, 'open');
      const MOCK_ITEM_URL: string = environment.siteUrl.replace('es', subdomain) + 'item/' + MOCK_ITEM.webSlug;
      component.goToItemDetail();
      expect(windowRef.nativeWindow.open).toHaveBeenCalledWith(MOCK_ITEM_URL);
    });
  });

  describe('removeFavorite', () => {
    beforeEach(() => {
      spyOn(component.onFavoriteChange, 'emit')
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
      removeFavoriteButton = fixture.debugElement.nativeElement.querySelector('tsl-card-footer');
      removeFavoriteButton.click();
    }));

    it('when click tsl-cardFooter should call removeFavoriteModal method', () => {
      expect(component.removeFavoriteModal).toHaveBeenCalled();
    });

    it('should open accept modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
    });

    it('should set modal type "3" ', () => {
      expect(modalRef.componentInstance.type).toEqual(3);
    });

    it('should call removeFavorite method ', fakeAsync(() => {
      tick();
      expect(component.removeFavorite).toHaveBeenCalled();
    }));
  })
});
