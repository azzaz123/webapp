import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ReportService } from '@core/trust-and-safety/report/report.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportUserComponent } from './report-user.component';

describe('ReportUserComponent', () => {
  let component: ReportUserComponent;
  let fixture: ComponentFixture<ReportUserComponent>;
  let reportService: ReportService;
  let activeModal: NgbActiveModal;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        providers: [NgbActiveModal, ReportService],
        declarations: [ReportUserComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    reportService = TestBed.inject(ReportService);
    activeModal = TestBed.inject(NgbActiveModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get and set report reasons', () => {
      spyOn(reportService, 'getUserReportReasons').and.callThrough();
      component.ngOnInit();
      expect(reportService.getUserReportReasons).toHaveBeenCalled();
    });
  });

  describe('selectReportUserReason', () => {
    it('should set the selectedReportUserReason with the given value', () => {
      component.selectReportUserReason(1);
      expect(component.selectedReportUserReason).toBe(1);
    });
  });

  describe('close', () => {
    it('should call close', () => {
      spyOn(activeModal, 'close');
      component.reportUserReasonMessage = 'message';
      component.selectedReportUserReason = 1;
      component.close();
      expect(activeModal.close).toHaveBeenCalledWith({
        message: 'message',
        reason: 1,
      });
    });
  });
});
