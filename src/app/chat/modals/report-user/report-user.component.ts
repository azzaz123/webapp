import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BanReason } from '../../../core/item/ban-reason.interface';

@Component({
  selector: 'tsl-report-user',
  templateUrl: './report-user.component.html'
})
export class ReportUserComponent implements OnInit {

  public userBanReasons: BanReason[];
  public selectedReportUserReason: number = null;
  public reportUserReasonMessage: string;

  constructor(private userService: UserService,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.userService.getBanReasons().subscribe((data: BanReason[]) => {
      this.userBanReasons = data;
    });
  }

  public selectReportUserReason(id: number): void {
    this.selectedReportUserReason = id;
  }

  public close() {
    this.activeModal.close({
      message: this.reportUserReasonMessage,
      reason: this.selectedReportUserReason
    });
  }

}
