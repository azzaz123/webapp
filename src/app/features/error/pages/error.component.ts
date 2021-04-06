import { Component } from '@angular/core';

@Component({
  selector: 'tsl-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {

  constructor(private router: Router) {}

  public navigateToHomePage(): void {
    this.router.navigate([APP_PATHS.PUBLIC]);
  }
}
