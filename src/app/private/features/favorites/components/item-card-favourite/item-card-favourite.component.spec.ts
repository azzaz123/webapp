import { of } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { ItemCardFavouriteComponent } from './item-card-favourite.component';
import { ItemService } from '@core/item/item.service';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { I18nService } from '@core/i18n/i18n.service';

describe('ItemCardFavouriteComponent', () => {
  let component: ItemCardFavouriteComponent;
  let fixture: ComponentFixture<ItemCardFavouriteComponent>;
  let element: HTMLElement;

  let itemService: ItemService;
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
        declarations: [ItemCardFavouriteComponent, CustomCurrencyPipe],
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

    fixture.detectChanges();
  });

  describe('goToItemDetail', () => {
    it('should change window url', () => {
      spyOn(window, 'open');
      const MOCK_ITEM_URL: string = environment.siteUrl.replace('es', subdomain) + 'item/' + MOCK_ITEM.webSlug;
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
    }));
  });
});
