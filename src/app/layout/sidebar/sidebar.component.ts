import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { User } from 'shield';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'tsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public user: User;
  public userUrl: string;

  constructor(private userService: UserService,
              private modalService: NgbModal,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.user = user;
      if (user) {
        this.userUrl = user.webLink.replace('http://es.wallapop.com/', environment.siteUrl.replace('es', this.subdomain));
      }
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

  public openProfileModal($event: any) {
    $event.preventDefault();
    const modalRef: NgbModalRef = this.modalService.open(ProfileModalComponent, {
      windowClass: 'profile',
      backdrop: 'static'
    });
    modalRef.componentInstance.userUrl = this.userUrl;
  }
}
