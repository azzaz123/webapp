import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ITEM_REPORT_REASONS } from '@core/trust-and-safety/report/constants/item-report-reasons';
import { ReportService } from '@core/trust-and-safety/report/report.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportListingComponent } from './report-listing.component';

describe('ReportListingComponent', () => {
  let component: ReportListingComponent;
  let fixture: ComponentFixture<ReportListingComponent>;
  let reportService: ReportService;
  let activeModal: NgbActiveModal;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, FormsModule],
        providers: [NgbActiveModal, ReportService],
        declarations: [ReportListingComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    reportService = TestBed.inject(ReportService);
    activeModal = TestBed.inject(NgbActiveModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should show item report reasons', () => {
      spyOn(reportService, 'getItemReportReasons').and.callThrough();
      component.ngOnInit();
      expect(reportService.getItemReportReasons).toHaveBeenCalled();
      expect(component.listingBanReasons).toEqual(ITEM_REPORT_REASONS);
    });
  });

  describe('selectReportListingReason', () => {
    it('should set the selectedReportListingReason with the given value', () => {
      const selectedItemReportReason = ITEM_REPORT_REASONS[0];

      component.selectReportListingReason(selectedItemReportReason);
      expect(component.selectedReportListingReason).toBe(selectedItemReportReason);
    });
  });

  describe('close', () => {
    it('should call close', () => {
      const SELECTED_ITEM_REPORT_REASON = ITEM_REPORT_REASONS[0];
      spyOn(activeModal, 'close');
      component.reportListingReasonMessage = 'message';
      component.selectedReportListingReason = SELECTED_ITEM_REPORT_REASON;

      component.close();

      expect(activeModal.close).toHaveBeenCalledWith({
        message: 'message',
        reason: SELECTED_ITEM_REPORT_REASON,
      });
    });
  });
});
