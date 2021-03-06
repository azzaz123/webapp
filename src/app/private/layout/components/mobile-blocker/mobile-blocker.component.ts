import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from '@core/user/user.service';
import { ADJUST_IOS_URL, ADJUST_ANDROID_URL } from '@core/constants';

@Component({
  selector: 'tsl-mobile-blocker',
  templateUrl: './mobile-blocker.component.html',
  styleUrls: ['./mobile-blocker.component.scss'],
})
export class MobileBlockerComponent implements OnInit {
  @Output() viewIsBlocked: EventEmitter<any> = new EventEmitter<any>();
  public isCardealer: boolean;
  public isMobile: boolean;
  public adjustIOSUrl = ADJUST_IOS_URL;
  public adjustAndroidUrl = ADJUST_ANDROID_URL;

  constructor(private deviceDetector: DeviceDetectorService, private userService: UserService) {}

  ngOnInit() {
    this.userService.isProfessional().subscribe((val) => {
      this.isCardealer = val;
      this.isMobile = this.deviceDetector.isMobile();
      if (this.isCardealer && this.isMobile) {
        this.viewIsBlocked.emit({
          isCardealer: this.isCardealer,
          isMobile: this.isMobile,
        });
      }
    });
  }
}
