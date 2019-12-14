import { environment } from './../../../environments/environment';
import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user';
import { TabbarService } from './tabbar.service';

@Component({
  selector: 'tsl-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss']
})
export class TabbarComponent implements OnInit {

  public user: User;
  public homeUrl: string;
  public hidden = false;

  constructor(private userService: UserService,
    private tabBarService: TabbarService,
    @Inject('SUBDOMAIN') private subdomain: string) {
    this.homeUrl = environment.siteUrl.replace('es', this.subdomain);
  }

  ngOnInit() {
    this.userService.me().subscribe(user => this.user = user);
    this.tabBarService.tabBarHidden$.subscribe(hidden => this.hidden = hidden);
  }

  private isFormElement(elementType: string) {
    return elementType === 'INPUT' || elementType === 'TEXTAREA';
  }

  @HostListener('window:focusin', ['$event.target.nodeName'])
  onFocusIn(elementType: string) {
    if (this.isFormElement(elementType)) {
      this.hidden = true;
    }
  }

  @HostListener('window:focusout', ['$event.target.nodeName'])
  onFocusOut(elementType: string) {
    if (this.isFormElement(elementType)) {
      this.hidden = false;
    }
  }
}
