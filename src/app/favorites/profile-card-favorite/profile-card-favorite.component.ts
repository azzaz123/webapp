import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { WindowRef } from '../../core/window/window.service';
import { UserService } from '../../core/user/user.service';
import { UserProfile } from '../../core/user/user-response.interface';

@Component({
  selector: 'tsl-profile-card-favorite',
  templateUrl: './profile-card-favorite.component.html',
  styleUrls: ['./profile-card-favorite.component.scss']
})
export class ProfileCardFavoriteComponent {

  @Input() profile: UserProfile;
  @Output() onFavoriteProfileChange: EventEmitter<UserProfile> = new EventEmitter();

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private windowRef: WindowRef,
              private trackingService: TrackingService,
              @Inject('SUBDOMAIN') private subdomain: string
  ) {
  }

  removeFavoriteModal(e: Event) {
    e.stopPropagation();
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.type = 3;
    modalRef.result.then(() => {
      this.removeFavorite();
    }, () => {});
  }

  removeFavorite() {
    this.userService.favoriteItem(this.profile.id, false).subscribe(() => {
      this.profile.favorited = false;
      this.onFavoriteProfileChange.emit(this.profile);
      //this.trackingService.track(TrackingService.PROFILE_FAVOURITES_BUTTON_UNFAVORITE);
    });
  }

}
