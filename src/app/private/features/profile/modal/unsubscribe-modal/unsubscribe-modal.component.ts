import { Component, Inject, OnInit } from '@angular/core';
import { EventService } from '@core/event/event.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { UnsubscribeReason } from '@core/user/unsubscribe-reason.interface';
import { UserService } from '@core/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SITE_URL } from '@configs/site-url.config';
import { combineLatest } from 'rxjs';
import { UNSUBSCRIBE_STEP } from './interfaces/unsubscribe-step.enum';
import { UNSUBSCRIBE_REASON } from './interfaces/unsubscribe-reason.enum';
@Component({
  selector: 'tsl-unsubscribe-modal',
  templateUrl: './unsubscribe-modal.component.html',
  styleUrls: ['./unsubscribe-modal.component.scss'],
})
export class UnsubscribeModalComponent implements OnInit {
  public step: number;
  public reasons: UnsubscribeReason[];
  public selectedReason: number;
  public customReason: string;
  public hasSubscription: boolean = false;
  public isProfessional: boolean = false;

  public readonly MAX_LENGHT_OHTER_REASON: number = 300;
  public readonly STEP = UNSUBSCRIBE_STEP;
  public readonly OTHER_REASON_ID: number = UNSUBSCRIBE_REASON.OTHER_REASON;

  public readonly REASONS_TEXT: Record<UNSUBSCRIBE_REASON, string> = {
    [UNSUBSCRIBE_REASON.NOT_USING_APP]: $localize`:@@delete_account_reason_view_all_users_dont_use_app_text:I'm not using the app`,
    [UNSUBSCRIBE_REASON.CANT_FIND_INTERESTING_ITEM]: $localize`:@@delete_account_reason_view_all_users_no_interesting_items_nor_sellers_text:Can't find interesting item`,
    [UNSUBSCRIBE_REASON.USE_OTHER_PLATFORMS]: $localize`:@@delete_account_reason_view_all_users_use_other_platform_text:I use other platforms`,
    [UNSUBSCRIBE_REASON.TECHNICAL_ISSUES]: $localize`:@@delete_account_reason_view_all_users_technical_issues_text:Technical issues`,
    [UNSUBSCRIBE_REASON.SECURITY_ISSUES]: $localize`:@@delete_account_reason_view_all_users_security_issues_text:Security issue`,
    [UNSUBSCRIBE_REASON.OTHER_REASON]: $localize`:@@delete_account_reason_view_all_users_other_reason_text:Other reason:`,
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
    this.step = this.STEP.CONFIRMATION;
  }

  public confirmDeleteAccount(): void {
    this.step = this.STEP.QUESTIONNAIRE;
  }

  public send(): void {
    this.userService.unsubscribe(this.selectedReason, this.customReason).subscribe(() => {
      this.activeModal.close();
      this.accessTokenService.deleteAccessToken();
      this.event.emit(EventService.USER_LOGOUT, this.siteUrl);
    });
  }
}
