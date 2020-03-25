import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogItemActionsComponent } from './catalog-item-actions.component';
import { ItemService } from '../../../core/item/item.service';
import { Observable, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  createItemsArray, ITEMS_BULK_RESPONSE,
  ITEMS_BULK_RESPONSE_FAILED, ITEMS_BULK_UPDATED_IDS
} from '../../../../tests/item.fixtures.spec';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { find } from 'lodash-es';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { Router } from '@angular/router';
import { EventService } from '../../../core/event/event.service';

describe('CatalogItemActionsComponent', () => {
  let component: CatalogItemActionsComponent;
  let fixture: ComponentFixture<CatalogItemActionsComponent>;
  let itemService: ItemService;
  let errorsService: ErrorsService;
  let modalService: NgbModal;
  let toastr: ToastrService;
  let trackingService: TrackingService;
  let router: Router;
  let eventService: EventService;
  const modal: any = {modal: true};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogItemActionsComponent ],
      providers: [
        I18nService,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
            deselectItems() {
            },
            bulkDelete() {
            },
            bulkSetDeactivate() {
            },
            bulkSetActivate() {
            },
            selectItem() {
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                componentInstance: {},
                result: Promise.resolve()
              };
            }
          }
        },
        {
          provide: ToastrService, useValue: {
            error() {
            }
          }
        },
        {
          provide: ErrorsService, useValue: {
            i18nError() {
            }
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
          }
        },
        EventService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogItemActionsComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    toastr = TestBed.get(ToastrService);
    trackingService = TestBed.get(TrackingService);
    errorsService = TestBed.get(ErrorsService);
    modalService = TestBed.get(NgbModal);
    router = TestBed.get(Router);
    eventService = TestBed.get(EventService);
    spyOn(modalService, 'open').and.callThrough();
    spyOn(toastr, 'error');
  });

  describe('ngOnInit', () => {
    it('should reset de selected items', () => {
      component.ngOnInit();

      expect(itemService.selectedItems.length).toBe(0);
    });
  });

  describe('deselect', () => {
    it('should call deselectItems', () => {
      spyOn(itemService, 'deselectItems');

      component.deselect();

      expect(itemService.deselectItems).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const TOTAL: number = 5;
    beforeEach(() => {
      component.selectedStatus = 'active';
      component.items = createItemsArray(TOTAL);
      component.active = true;
    });

    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(of(ITEMS_BULK_RESPONSE));

        component.delete(modal);
        tick();
      }));

      it('should call modal and bulkDelete', () => {
        expect(modalService.open).toHaveBeenCalledWith(modal);
        expect(itemService.bulkDelete).toHaveBeenCalledWith('active');
      });

      it('should remove deleted items', () => {
        expect(component.items.length).toBe(TOTAL - 3);
        expect(find(component.items, {'id': '1'})).toBeFalsy();
        expect(find(component.items, {'id': '3'})).toBeFalsy();
        expect(find(component.items, {'id': '5'})).toBeFalsy();
      });
    });

    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(of(ITEMS_BULK_RESPONSE_FAILED));

        component.delete(modal);
        tick();
      }));

      it('should open error toastr', () => {
        expect(toastr.error).toHaveBeenCalledWith('Some listings have not been deleted due to an error');
      });
    });
  });

  describe('feature', () => {
    it('should redirect to the checkout if no featured items are selected', () => {
      spyOn(router, 'navigate');
      component.items = createItemsArray(3);
      component.itemService.selectedItems = ITEMS_BULK_UPDATED_IDS;

      component.feature();

      expect(modalService.open).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/checkout']);
    });
  });

  describe('activate', () => {
    const TOTAL: number = 5;
    beforeEach(() => {
      component.selectedStatus = 'active';
      component.items = createItemsArray(TOTAL);
      component.active = true;
    });

    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkSetActivate').and.returnValue(of('200'));

        component.activate();
        tick();
      }));

      it('should call modal and activate', () => {
        expect(modalService.open).toHaveBeenCalled();
        expect(itemService.bulkSetActivate).toHaveBeenCalled();
      });

    });

  });

  describe('deactivate', () => {
    const TOTAL: number = 5;
    beforeEach(() => {
      component.selectedStatus = 'active';
      component.items = createItemsArray(TOTAL);
      component.active = true;
    });

    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(trackingService, 'track').and.callThrough();
        spyOn(itemService, 'bulkSetDeactivate').and.returnValue(of('200'));

        component.deactivate();
        tick();
      }));

      it('should call modal and deactivate', () => {
        expect(modalService.open).toHaveBeenCalled();
        expect(itemService.bulkSetDeactivate).toHaveBeenCalled();
      });

      it('should send a tracking event', () => {
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MYCATALOG_PRO_MODAL_DEACTIVATE);
      });

    });

  });

  describe('selectAll', () => {
    it('should mark all items as selected', () => {
      component.items = createItemsArray(5);

      component.selectAll();

      component.items.forEach(item => expect(item.selected).toBe(true));
    });

    it('should call n times the selectItem function', () => {
      const TOTAL = 5;
      component.items = createItemsArray(TOTAL);
      spyOn(itemService, 'selectItem');

      component.selectAll();

      expect(itemService.selectItem).toHaveBeenCalledTimes(TOTAL);
    });
  });

});
