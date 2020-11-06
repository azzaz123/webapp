import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../core/user/user.service';
import { UnsubscribeReason } from '../../core/user/unsubscribe-reason.interface';
import { EventService } from '../../core/event/event.service';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../../core/http/access-token.service';
import { User } from '../../core/user/user';

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

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private event: EventService,
    private accessTokenService: AccessTokenService
  ) {}

  ngOnInit() {
    this.userService
      .getUnsubscribeReasons()
      .subscribe((reasons: UnsubscribeReason[]) => {
        this.reasons = reasons;
      });
    this.userService
      .isProUser()
      .subscribe((isPro) => (this.hasSubscription = isPro));
  }

  public send() {
    this.userService
      .unsubscribe(this.selectedReason, this.customReason)
      .subscribe(() => {
        this.activeModal.close();
        this.accessTokenService.deleteAccessToken();
        this.event.emit(EventService.USER_LOGOUT, environment.siteUrl);
      });
  }
}
