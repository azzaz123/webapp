import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ProfileService } from '../../core/profile/profile.service';
import { Profile } from '../../core/profile/profile';

@Component({
  selector: 'tsl-profile-card-favorite',
  templateUrl: './profile-card-favorite.component.html',
  styleUrls: ['./profile-card-favorite.component.scss']
})
export class ProfileCardFavoriteComponent {

  @Input() profile: Profile;
  @Output() onFavoriteProfileChange: EventEmitter<Profile> = new EventEmitter();

  constructor(private modalService: NgbModal,
              private trackingService: TrackingService,
              private profileService: ProfileService) {
  }

  removeFavoriteModal(e: Event) {
    e.stopPropagation();
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.type = this.profile.isProfessional ? 5 : 6;
    modalRef.result.then(() => {
      this.removeFavorite();
    }, () => {});
  }

  removeFavorite() {
    this.profileService.favoriteItem(this.profile.id, false).subscribe(() => {
      this.profile.favorited = false;
      this.onFavoriteProfileChange.emit(this.profile);
      //this.trackingService.track(TrackingService.PROFILE_FAVOURITES_BUTTON_UNFAVORITE);
    });
  }

}
