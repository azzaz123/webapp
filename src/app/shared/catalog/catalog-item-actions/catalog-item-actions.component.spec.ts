import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogItemActionsComponent } from './catalog-item-actions.component';
import { ItemService } from '../../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MOCK_ITEM, createItemsArray, ITEMS_BULK_RESPONSE,
  ITEMS_BULK_RESPONSE_FAILED
} from '../../../../tests/item.fixtures.spec';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ErrorsService } from '../../../core/errors/errors.service';

fdescribe('CatalogItemActionsComponent', () => {
  let component: CatalogItemActionsComponent;
  let fixture: ComponentFixture<CatalogItemActionsComponent>;
  let itemService: ItemService;
  let errorsService: ErrorsService;
  let modalService: NgbModal;
  let toastr: ToastrService;
  let trackingService: TrackingService;
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
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
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
    fixture.detectChanges();
    spyOn(modalService, 'open').and.callThrough();
    spyOn(toastr, 'error');
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
    });

    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE));

        component.delete(modal);
        tick();
      }));

      it('should call modal and bulkDelete', () => {
        expect(modalService.open).toHaveBeenCalledWith(modal);
        expect(itemService.bulkDelete).toHaveBeenCalledWith('active');
      });

      it('should remove deleted items', () => {
        expect(component.items.length).toBe(TOTAL - 3);
        expect(_.find(component.items, {'id': '1'})).toBeFalsy();
        expect(_.find(component.items, {'id': '3'})).toBeFalsy();
        expect(_.find(component.items, {'id': '5'})).toBeFalsy();
      });
    });

    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE_FAILED));

        component.delete(modal);
        tick();
      }));

      it('should open error toastr', () => {
        expect(toastr.error).toHaveBeenCalledWith('Some listings have not been deleted due to an error');
      });
    });
  });
});
