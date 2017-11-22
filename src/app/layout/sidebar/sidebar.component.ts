import { Component } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

@Component({
  selector: 'tsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(private userService: UserService,
              private modalService: NgbModal) {
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

  public openProfileModal($event: any) {
    $event.preventDefault();
    this.modalService.open(ProfileModalComponent, {windowClass: 'profile'});
  }
}
