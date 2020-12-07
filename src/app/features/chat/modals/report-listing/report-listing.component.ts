import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BanReason } from '../../../core/item/ban-reason.interface';
import { ItemService } from '../../../core/item/item.service';

@Component({
  selector: 'tsl-report-listing',
  templateUrl: './report-listing.component.html',
})
export class ReportListingComponent implements OnInit {
  public listingBanReasons: BanReason[];
  public selectedReportListingReason: number = null;
  public reportListingReasonMessage: string;

  constructor(
    private itemService: ItemService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.itemService.getBanReasons().subscribe((data: BanReason[]) => {
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
