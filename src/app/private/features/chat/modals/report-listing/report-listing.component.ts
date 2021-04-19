import { Component, OnInit } from '@angular/core';
import { ReportReason } from '@core/trust-and-safety/report/interfaces/report-reason.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '@core/trust-and-safety/report/report.service';

@Component({
  selector: 'tsl-report-listing',
  templateUrl: './report-listing.component.html',
})
export class ReportListingComponent implements OnInit {
  public listingBanReasons: ReportReason[];
  public selectedReportListingReason: number = null;
  public reportListingReasonMessage: string;

  constructor(private reportService: ReportService, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.reportService.getItemReportReasons().subscribe((data: ReportReason[]) => {
      this.listingBanReasons = data;
    });
  }

  public selectReportListingReason(id: number): void {
    this.selectedReportListingReason = id;
  }

  public close() {
    this.activeModal.close({
      message: this.reportListingReasonMessage,
      reason: this.selectedReportListingReason,
    });
  }
}
