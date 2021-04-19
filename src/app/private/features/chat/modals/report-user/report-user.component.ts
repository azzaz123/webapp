import { Component, OnInit } from '@angular/core';
import { ReportReason } from '@core/trust-and-safety/report/interfaces/report-reason.interface';
import { ReportService } from '@core/trust-and-safety/report/report.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-report-user',
  templateUrl: './report-user.component.html',
})
export class ReportUserComponent implements OnInit {
  public userReportReasons: ReportReason[];
  public selectedReportUserReason: number = null;
  public reportUserReasonMessage: string;

  constructor(public activeModal: NgbActiveModal, private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getUserReportReasons().subscribe((data: ReportReason[]) => {
      this.userReportReasons = data;
    });
  }

  public selectReportUserReason(id: number): void {
    this.selectedReportUserReason = id;
  }

  public close() {
    this.activeModal.close({
      message: this.reportUserReasonMessage,
      reason: this.selectedReportUserReason,
    });
  }
}
