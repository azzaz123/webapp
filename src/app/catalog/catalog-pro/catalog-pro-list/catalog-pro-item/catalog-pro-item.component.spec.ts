import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogProItemComponent } from './catalog-pro-item.component';
import { ItemService } from '../../../../core/item/item.service';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { MOCK_ITEM } from '../../../../../tests/item.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { MomentModule } from 'angular2-moment';

describe('CatalogProItemComponent', () => {
  let component: CatalogProItemComponent;
  let fixture: ComponentFixture<CatalogProItemComponent>;
  let itemService: ItemService;
  let modalService: NgbModal;
  let trackingService: TrackingService;
  let errorsService: ErrorsService;
  const componentInstance = {
    price: null,
    item: null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogProItemComponent, CustomCurrencyPipe ],
      imports: [ MomentModule ],
      providers: [
        DecimalPipe,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
          selectedItems: [],
          selectItem() {
          },
          deselectItem() {
          },
          deleteItem() {
            return Observable.of({});
          },
          reserveItem() {
            return Observable.of({});
          },
          reactivateItem() {
            return Observable.of({});
          },
          getAvailableReactivationProducts() {
          },
          canDoAction() {
            return Observable.of(true);
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              result: Promise.resolve(),
              componentInstance: componentInstance
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
        {provide: 'SUBDOMAIN', useValue: 'es'}
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogProItemComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
    itemService = TestBed.get(ItemService);
    modalService = TestBed.get(NgbModal);
    trackingService = TestBed.get(TrackingService);
    errorsService = TestBed.get(ErrorsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
