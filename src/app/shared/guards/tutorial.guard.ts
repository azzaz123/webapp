import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TutorialService } from '../../core/tutorial/tutorial.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class TutorialGuard implements CanActivate {

  constructor(private tutorialService: TutorialService,
              private router: Router,
              private deviceService: DeviceDetectorService) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.tutorialService.isAlreadyDisplayed()
    .map((displayed: boolean) => {
      if (!displayed && !this.deviceService.isMobile()) {
        this.router.navigate(['tutorial']);
        return false;
      }
      return true;
    });
  }
}
