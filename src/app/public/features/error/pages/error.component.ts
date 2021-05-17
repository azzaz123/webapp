import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ERROR_BOX_EXIT_TYPE } from '@shared/error-box/interfaces/error-box-exit-type';
import { ErrorBoxExit } from '@shared/error-box/interfaces/error-box-exit.interface';
import { APP_PATHS } from 'app/app-routing-constants';

@Component({
  selector: 'tsl-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  public title = $localize`:@@web_not_found_title:Whoops, the page you're looking for can't be found`;
  public subtitle = $localize`:@@web_not_found_message:Our office unicorn might have impaled it. But, there's lots to be discovered in the land of Wallapop.`;
  public image = '/assets/images/not-found.png';
  public errorBoxButton: ErrorBoxExit = {
    type: ERROR_BOX_EXIT_TYPE.BUTTON,
    label: $localize`:@@web_not_found_button_text:See listings`,
  };

  constructor(private router: Router) {}

  public navigateToHomePage(): void {
    this.router.navigate([APP_PATHS.PUBLIC]);
  }
}
