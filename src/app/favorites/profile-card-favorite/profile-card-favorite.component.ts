import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Item } from '../../core/item/item';
import { WindowRef } from '../../core/window/window.service';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'tsl-profile-card-favorite',
  templateUrl: './profile-card-favorite.component.html',
  styleUrls: ['./profile-card-favorite.component.scss']
})
export class ProfileCardFavoriteComponent implements OnInit {

  @Input() item: Item;
  @Output() onFavoriteChange: EventEmitter<Item> = new EventEmitter();

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private windowRef: WindowRef,
              private trackingService: TrackingService,
              @Inject('SUBDOMAIN') private subdomain: string
  ) {
  }

  ngOnInit() {
  }

  goToProfile() {
    //const url = this.item.getUrl(this.subdomain);
    //this.windowRef.nativeWindow.open(url);
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
    /*this.itemService.favoriteItem(this.item.id, false).subscribe(() => {
      this.item.favorited = false;
      this.onFavoriteChange.emit(this.item);
      this.trackingService.track(TrackingService.FAVOURITES_BUTTON_UNFAVORITE);
    });*/
  }

}
