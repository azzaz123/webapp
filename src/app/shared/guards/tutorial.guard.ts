import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TutorialService } from '../../core/tutorial/tutorial.service';

@Injectable()
export class TutorialGuard implements CanActivate {

  constructor(private tutorialService: TutorialService,
              private router: Router) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.tutorialService.isAlreadyDisplayed()
    .map((displayed: boolean) => {
      if (!displayed) {
        this.router.navigate(['tutorial']);
        return false;
      }
      return true;
    });
  }
}
