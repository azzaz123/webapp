import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { TutorialService } from '../../core/tutorial/tutorial.service';
import { User } from '../../core/user/user';
import { MessageService } from '../../core/message/message.service';

@Component({
  selector: 'tsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public user: User;
  @Input() isProducts: boolean;
  @Input() isProfile: boolean;
  public isProfessional: boolean;
  public withCoins: boolean;

  constructor(private userService: UserService,
              public tutorialService: TutorialService,
              public messageService: MessageService) {
  }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.user = user;
    });
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
    this.userService.hasPerm('coins').subscribe((withCoins: boolean) => {
      this.withCoins = withCoins;
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }
}
