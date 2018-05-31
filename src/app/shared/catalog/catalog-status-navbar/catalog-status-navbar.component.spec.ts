import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogStatusNavbarComponent } from './catalog-status-navbar.component';
import { PaymentService } from '../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { ScheduledStatus } from '../../../core/payments/payment.interface';

describe('CatalogStatusNavbarComponent', () => {
  let component: CatalogStatusNavbarComponent;
  let fixture: ComponentFixture<CatalogStatusNavbarComponent>;
  let paymentService: PaymentService;

  const MOCK_STATUS: ScheduledStatus = {
    active: true,
    autorenew_alert: 0,
    autorenew_scheduled: { citybump: 16, countrybump: 21 },
    purchased: { citybump: 1, countrybump: 2 }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogStatusNavbarComponent ],
      providers: [
        {
          provide: PaymentService, useValue: {
          getStatus() {
            return Observable.of({MOCK_STATUS});
          }
        }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogStatusNavbarComponent);
    paymentService = TestBed.get(PaymentService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set the bumps counter', () => {
      spyOn(paymentService, 'getStatus').and.returnValue(Observable.of(MOCK_STATUS));

      component.ngOnInit();

      expect(paymentService.getStatus).toHaveBeenCalled();
      expect(component.bumpsCounter).toBe(3);
    });

  });

  describe('select status', () => {
    let event: any;
    let status = 'active';

    beforeEach(fakeAsync(() => {
      component.filterByStatus.subscribe(($event: any) => {
        event = $event;
      });
      spyOn(component.filterByStatus, 'emit');
      component.selectStatus(status);

    }));

    afterEach(() => {
      event = undefined;
    });

    it('should set the new status selected', () => {
      expect(component.selectedStatus).toBe(status);
    });
    
    it('should emit an event', () => {
      expect(component.filterByStatus.emit).toHaveBeenCalledWith(status);
    });

  });
});
