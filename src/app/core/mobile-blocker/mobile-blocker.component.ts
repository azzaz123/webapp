import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from '../user/user.service';

@Component({
  selector: 'tsl-mobile-blocker',
  templateUrl: './mobile-blocker.component.html',
  styleUrls: ['./mobile-blocker.component.scss']
})
export class MobileBlockerComponent implements OnInit {

  public isCardealer: boolean;
  public isMobile: boolean;

  constructor(
    private deviceDetector: DeviceDetectorService,
    private userService: UserService
  ) {
  }
  
  ngOnInit() {
    this.userService.isProfessional().subscribe(val => this.isCardealer = val);
    this.isMobile = this.deviceDetector.isMobile();
  }
}
