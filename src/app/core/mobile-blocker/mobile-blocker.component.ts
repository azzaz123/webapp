import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from '../user/user.service';

@Component({
  selector: 'tsl-mobile-blocker',
  templateUrl: './mobile-blocker.component.html',
  styleUrls: ['./mobile-blocker.component.scss']
})
export class MobileBlockerComponent {

  public isPro: boolean;
  public isMobile: boolean;

  constructor(
    private deviceDetector: DeviceDetectorService,
    private userService: UserService
  ) {
    this.userService.isProUser().subscribe(val => this.isPro = val);
    this.isMobile = this.deviceDetector.isMobile();
  }

}
