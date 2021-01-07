import { Component } from '@angular/core';

@Component({
  selector: 'tsl-private',
  templateUrl: './private.component.html',
})
export class PrivateComponent {
  //TODO: All this variables/functions are temporary
  // and will be removed when moving the logic + routing from the app.component
  // to the private.component
  public isMyZone = false;
  public hideSidebar = false;
  public isProducts = false;
  public isProfile = false;

  public onViewIsBlocked(): void {
    return;
  }
}
