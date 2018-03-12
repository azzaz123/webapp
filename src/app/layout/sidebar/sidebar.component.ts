import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { MessageService, User } from 'shield';
import { TutorialService } from '../../core/tutorial/tutorial.service';

@Component({
  selector: 'tsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public user: User;
  @Input() isProducts: boolean;

  constructor(private userService: UserService,
              public tutorialService: TutorialService,
              public messageService: MessageService) {
  }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.user = user;
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }
}
