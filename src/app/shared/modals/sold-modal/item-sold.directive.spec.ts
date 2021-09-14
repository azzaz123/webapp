import { Component, DebugElement, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { ErrorsService } from '../../../core/errors/errors.service';
import { ItemService } from '../../../core/item/item.service';
import { ItemSoldDirective } from './item-sold.directive';
import createSpy = jasmine.createSpy;
import { Item } from '../../../core/item/item';
import { MOCK_ITEM } from '../../../../tests/item.fixtures.spec';
import { SoldModalComponent } from './sold-modal.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  template: `<button tslItemSold (callback)="setSold(item)" [item]="item"></button>`,
})
class TestComponent {
  item: Item;
  callback: EventEmitter<any>;
  setSold: Function = createSpy('setSold');
}

describe('ItemSoldDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;
  let itemService: ItemService;
  let modalService: NgbModal;
  let errorsService: ErrorsService;
  const modalInstance = {
    item: null,
    callback: null,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItemSoldDirective, TestComponent],
        providers: [
          {
            provide: ItemService,
            useValue: {
              selectedItems: [],
              selectItem() {},
              deselectItem() {},
              deleteItem() {
                return of({});
              },
              reserveItem() {
                return of({});
              },
              reactivateItem() {
                return of({});
              },
              getAvailableReactivationProducts() {},
              canDoAction() {
                return of(true);
              },
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                  componentInstance: modalInstance,
                };
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
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    modalService = TestBed.inject(NgbModal);
    errorsService = TestBed.inject(ErrorsService);
    element = fixture.debugElement.queryAll(By.directive(ItemSoldDirective))[0];
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('can mark as sold', () => {
    let item: Item;
    let callback: EventEmitter<any>;

    beforeEach(fakeAsync(() => {
      item = MOCK_ITEM;
      callback = new EventEmitter();
      fixture.componentInstance.item = item;
      spyOn(itemService, 'canDoAction').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      fixture.detectChanges();
      element.triggerEventHandler('click', {});
      tick();
    }));

    it('should call the canDoAction method on itemService when clicked', () => {
      expect(modalInstance.item).toEqual(item);
    });

    it('should set the item inside the modal to the component item', () => {
      expect(itemService.canDoAction).toHaveBeenCalledWith('mark_sold', item.id);
    });

    it('should open modal', fakeAsync(() => {
      expect(modalService.open).toHaveBeenCalledWith(SoldModalComponent, {
        windowClass: 'sold',
      });
    }));

    it('should set sold true', () => {
      expect(fixture.componentInstance.item.sold).toBe(true);
    });

    it('should emit the the callback event', () => {
      expect(component.setSold).toHaveBeenCalled();
    });
  });

  describe('cannot mark as sold', () => {
    beforeEach(fakeAsync(() => {
      fixture.componentInstance.item = MOCK_ITEM;
      spyOn(itemService, 'canDoAction').and.returnValue(of(false));
      spyOn(errorsService, 'i18nError');
      fixture.detectChanges();
      element.triggerEventHandler('click', {});
    }));

    it('should call canDoAction', () => {
      expect(itemService.canDoAction).toHaveBeenCalledWith('mark_sold', MOCK_ITEM.id);
    });

    it('should throw error', () => {
      expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.EDIT_ITEM_ERROR);
    });
  });
});
