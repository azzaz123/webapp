import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BanReason } from '@core/item/ban-reason.interface';
import { ItemService } from '@core/item/item.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ReportListingComponent } from './report-listing.component';

describe('ReportListingComponent', () => {
  let component: ReportListingComponent;
  let fixture: ComponentFixture<ReportListingComponent>;
  let itemService: ItemService;
  let activeModal: NgbActiveModal;

  const BAN_REASONS: BanReason[] = [
    {
      id: 1,
      label: 'ban reason',
    },
  ];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        providers: [
          NgbActiveModal,
          {
            provide: ItemService,
            useValue: {
              getBanReasons() {
                return of(BAN_REASONS);
              },
            },
          },
        ],
        declarations: [ReportListingComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    itemService = TestBed.inject(ItemService);
    activeModal = TestBed.inject(NgbActiveModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get and set ban reasons', () => {
      spyOn(itemService, 'getBanReasons').and.callThrough();
      component.ngOnInit();
      expect(itemService.getBanReasons).toHaveBeenCalled();
      expect(component.listingBanReasons).toEqual(BAN_REASONS);
    });
  });

  describe('selectReportListingReason', () => {
    it('should set the selectedReportListingReason with the given value', () => {
      component.selectReportListingReason(1);
      expect(component.selectedReportListingReason).toBe(1);
    });
  });

  describe('close', () => {
    it('should call close', () => {
      spyOn(activeModal, 'close');
      component.reportListingReasonMessage = 'message';
      component.selectedReportListingReason = 1;
      component.close();
      expect(activeModal.close).toHaveBeenCalledWith({
        message: 'message',
        reason: 1,
      });
    });
  });
});
