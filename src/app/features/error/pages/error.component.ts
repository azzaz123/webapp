import { Component } from '@angular/core';

@Component({
  selector: 'tsl-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  public title = $localize`:@@NotFoundTitle:Whoops, the page you're looking for can't be found`;
  public subtitle = $localize`:@@NotFoundMessage:Our office unicorn might have impaled it. But, there's lots to be discovered in the land of Wallapop.`;

  constructor(private router: Router) {}

  public navigateToHomePage(): void {
    this.router.navigate([APP_PATHS.PUBLIC]);
  }
}
