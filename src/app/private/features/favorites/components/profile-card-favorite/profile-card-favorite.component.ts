import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ProfileService } from '@core/profile/profile.service';
import { Profile } from '@core/profile/profile';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { COLORS } from '@core/colors/colors-constants';

@Component({
  selector: 'tsl-profile-card-favorite',
  templateUrl: './profile-card-favorite.component.html',
  styleUrls: ['./profile-card-favorite.component.scss'],
})
export class ProfileCardFavoriteComponent {
  @Input() profile: Profile;
  @Output() onFavoriteProfileChange: EventEmitter<Profile> = new EventEmitter();

  constructor(private modalService: NgbModal, private profileService: ProfileService, private i18nService: I18nService) {}

  removeFavoriteModal(e: Event) {
    e.stopPropagation();

    const title = this.profile.is_professional
      ? TRANSLATION_KEY.REMOVE_FEATURED_PROFILE_FAVORITE_TITLE
      : TRANSLATION_KEY.PROFILE_NO_LONGER_FEATURED_TITLE;
    const description = this.profile.is_professional
      ? TRANSLATION_KEY.REMOVE_FEATURED_PROFILE_FAVORITE_DESCRIPTION
      : TRANSLATION_KEY.PROFILE_NO_LONGER_FEATURED_DESCRIPTION;

    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt',
    });

    modalRef.componentInstance.properties = {
      title: this.i18nService.translate(title),
      description: this.i18nService.translate(description),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.REMOVE_BUTTON),
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

    modalRef.result.then(
      () => {
        this.removeFavorite();
      },
      () => {}
    );
  }

  removeFavorite() {
    this.profileService.favoriteItem(this.profile.id, false).subscribe(() => {
      this.profile.favorited = false;
      this.onFavoriteProfileChange.emit(this.profile);
    });
  }
}
