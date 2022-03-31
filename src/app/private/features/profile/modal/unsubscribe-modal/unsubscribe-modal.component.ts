import { Component, Inject, OnInit } from '@angular/core';
import { EventService } from '@core/event/event.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { UnsubscribeReason } from '@core/user/unsubscribe-reason.interface';
import { UserService } from '@core/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SITE_URL } from '@configs/site-url.config';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'tsl-unsubscribe-modal',
  templateUrl: './unsubscribe-modal.component.html',
  styleUrls: ['./unsubscribe-modal.component.scss'],
})
export class UnsubscribeModalComponent implements OnInit {
  public step = 1;
  public reasons: UnsubscribeReason[];
  public selectedReason: number;
  public customReason: string;
  public hasSubscription = false;
  public isProfessional = false;

  public readonly REASONS_TEXT = {
    1: $localize`:@@delete_account_reason_view_all_users_dont_use_app_text:I'm not using the app`,
    2: $localize`:@@delete_account_reason_view_all_users_no_interesting_items_nor_sellers_text:Can't find interesting item`,
    3: $localize`:@@delete_account_reason_view_all_users_use_other_platform_text:I use other platforms`,
    4: $localize`:@@delete_account_reason_view_all_users_technical_issues_text:Technical issues`,
    5: $localize`:@@delete_account_reason_view_all_users_security_issues_text:Security issue`,
    6: $localize`:@@delete_account_reason_view_all_users_other_reason_text:Other reason:`,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private event: EventService,
    private accessTokenService: AccessTokenService,
    @Inject(SITE_URL) private siteUrl: string
  ) {}

  ngOnInit() {
    combineLatest([this.userService.getUnsubscribeReasons(), this.userService.isProfessional()]).subscribe(
      ([reasons, isProfessional]: [UnsubscribeReason[], boolean]) => {
        this.reasons = reasons;
        this.isProfessional = isProfessional;
      }
    );

    this.hasSubscription = this.userService.isProUser();
  }

  public send() {
    this.userService.unsubscribe(this.selectedReason, this.customReason).subscribe(() => {
      this.activeModal.close();
      this.accessTokenService.deleteAccessToken();
      this.event.emit(EventService.USER_LOGOUT, this.siteUrl);
    });
  }
}
